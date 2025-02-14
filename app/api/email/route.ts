import { NextResponse, NextRequest } from "next/server";

import { db } from "@/db/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm";

const axios = require('axios');

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();  

        const authToken = request.cookies.get('auth_token');
        if (!authToken) {
            console.log("No auth token found !");
            return NextResponse.json({ message: 'No auth token found' }, { status: 401 });
        }
        const historyID = body.historyID;   
        const stringToken = authToken.value;
        try {
            const existingUser = await db
                .select()
                .from(users)
                .where(eq(users.access_token, stringToken))
                .limit(1);
            if (existingUser.length > 0) {
                const sub = existingUser[0].sub
                try {
                    const user = await db.select().from(users).where(eq(users.sub, sub)).limit(1);
                    // DBH Database history ID 
                    const DBH = user[0].historyID
                    if (DBH === "default") {
                        const response = await axios.get(
                            `https://gmail.googleapis.com/gmail/v1/users/${sub}/history?startHistoryId=${historyID}&historyTypes=messageAdded`,
                            {
                              headers: {
                                Authorization: `Bearer ${stringToken}`,
                                Accept: "application/json",
                              },
                            }
                        );
                        await db
                            .update(users)
                            .set({historyID: historyID})
                            .where(eq(users.sub, sub))
                    } else {
                        const response = await axios.get(
                            `https://gmail.googleapis.com/gmail/v1/users/${sub}/history?startHistoryId=${DBH}&historyTypes=messageAdded`,
                            {
                              headers: {
                                Authorization: `Bearer ${stringToken}`,
                                Accept: "application/json",
                              },
                            }
                        );
                        if (response.data.history && Array.isArray(response.data.history) && response.data.history.length > 0) {
                            // Sortiere die history-Daten, wenn sie existieren
                            const latestHistory = response.data.history.sort((a: { id: string }, b: { id: string }) => parseInt(b.id) - parseInt(a.id))[0];
                          
                            // Hol dir die neue historyId
                            const UHID = latestHistory.id;
                          
                            // Aktualisiere die Datenbank
                            await db
                              .update(users)
                              .set({ historyID: UHID })
                              .where(eq(users.sub, sub));
                          
                            
                            const threadID = latestHistory.messages[0].threadId;
                            const messageID = latestHistory.messages[0].id

                            try {
                                const response = await axios.get(
                                    `https://gmail.googleapis.com/gmail/v1/users/${sub}/messages/${messageID}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${stringToken}`,
                                            Accept: "application/json",
                                        }
                                    }
                                );
                                interface GmailHeader {
                                    name: string;
                                    value: string;
                                }
                                const messageData = response.data;
                                const headers: GmailHeader[] = messageData.payload.headers;

                                // Extrahiere den Absender und den Betreff
                                const from = headers.find((header) => header.name === "From")?.value;
                                const subject = headers.find((header) => header.name === "Subject")?.value;

                                // Suche nach der text/plain oder text/html Version im parts-Array
                                let content = "Kein Inhalt verfügbar"; // Standardwert

                                for (const part of messageData.payload.parts) {
                                    if (part.mimeType === "text/plain" || part.mimeType === "text/html") {
                                        const partData = part.body.data;
                                        if (partData) {
                                            // Entschlüssel den Base64-kodierten Inhalt
                                            content = Buffer.from(partData, 'base64').toString('utf-8');
                                            break; // Sobald wir den Inhalt gefunden haben, beenden wir die Schleife
                                        }
                                    }
                                }

                                console.log("Absender:", from);
                                console.log("Betreff:", subject);
                                console.log("Inhalt:", content);
                            } catch (err) {
                                console.error("Fehler bei der Anfrage:", err);
                            }


                        } else {
                            console.error("Keine History-Daten gefunden oder das Array ist leer");
                        }
                    }
                } catch (err) {
                    console.error(err)
                }
            } 

        } catch (err) {
            console.error(err)
        }

        return NextResponse.json({ message: "success", status: 200 })
    } catch (err) {
        return NextResponse.json({ message: "validating email catch error", status: 400 })
    }
}