import { NextResponse, NextRequest } from "next/server";

import { db } from "@/db/db"
import { users, change_logs } from "@/db/schema"
import { eq } from "drizzle-orm";

const axios = require('axios');

export async function POST(request: NextRequest) {
    try {
        const authToken = request.cookies.get('auth_token');
        if (!authToken) {
            console.log("No auth token found !");
            return NextResponse.json({ message: 'No auth token found' }, { status: 401 });
        }
        const stringToken = authToken.value;
        try {
            const changeLogs = await db
                .select()
                .from(change_logs)
                .where(eq(change_logs.access_token, stringToken));
        
            
            if (changeLogs.length > 0) {
                changeLogs.forEach(item => {
                    if (item.datum !== null) {
                        const currentDate = new Date();
                        const changeLogDate = item.datum

                        const logID = item.id
                       
                        const diffInMilliseconds = currentDate.getTime() - changeLogDate.getTime();
                        if (diffInMilliseconds > 600000) {
                            console.log(logID, "is outdated");
                        }
                    } else {
                        console.log("Datum ist null.");
                    }
                });
            } else {
                console.log("Keine Datensätze gefunden.");
            }
        } catch (error) {
            console.error("Fehler bei der Datenbankabfrage:", error);
        }

        return NextResponse.json({ message: 'succcess' }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Get Logs failed !' }, { status: 401 });
    }
}