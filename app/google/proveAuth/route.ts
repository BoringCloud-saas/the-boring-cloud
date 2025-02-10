import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

import axios from "axios"

export async function POST(request: NextRequest, res: NextResponse) {
    try {
        const authToken = request.cookies.get('auth_token');

        if (!authToken) {
            console.log("No auth token found !");
            return NextResponse.json({ message: 'No auth token or email found' }, { status: 401 });
        }

        const stringToken = authToken.value;
        console.log("0")
        const result = await db.select().from(users).where(eq(users.access_token, stringToken));
        console.log("1")
        if (result.length === 0) {
            return NextResponse.json({ message: 'Wrong access Token !' }, { status: 401 });
        } else {
            // prüfe ob token abgelaufen ist
            console.log("2")
            try {
                console.log("3 try")
                const response = await axios.get("https://www.googleapis.com/oauth2/v3/tokeninfo", {
                    params: { access_token: stringToken },
                });
                const data = response.data;
                const expiresInSeconds = parseInt(data.expires_in, 10);
                const minutes = Math.floor(expiresInSeconds / 60);
                const seconds = expiresInSeconds % 60;

                const result = await db.select().from(users).where(eq(users.access_token, stringToken));
                const userInfo = result[0]
                const { name } = userInfo

                console.log(`Token läuft ab in: ${minutes} Minuten und ${seconds} Sekunden`);
                return NextResponse.json({ message: name }, { status: 200 });
            } catch (err) {
                console.log("3 catch")
                const result = await db.select().from(users).where(eq(users.access_token, stringToken));
                const refreshToken = result[0].refresh_token
                console.log("4 catch")
                const tokenUrl = 'https://oauth2.googleapis.com/token';
                    const tokenResponse = await fetch(tokenUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({
                            client_id: process.env.GOOGLE_CLIENT_ID || "",
                            client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
                            refresh_token: refreshToken,
                            grant_type: "refresh_token",
                        }).toString(),
                    });

                    const data = await tokenResponse.json()
                    const newAccessToken = data.access_token
                    console.log("access token new data ----------> ", data)
                    try {
                        await db
                            .update(users)
                            .set({access_token: newAccessToken})
                            .where(eq(users.access_token, stringToken));
                    
                        console.log("access token refreshed in NEON DB !")
                        const response = NextResponse.json({ message: "Token refreshed in users and sub accounts" }, { status: 200 });
                        response.cookies.set("auth_token", newAccessToken, {
                                httpOnly: true,
                                secure: true,
                                path: "/",
                        });
                        return response
                    } catch (err) {
                        //console.error(err)
                    }
            }
        }
    } catch (err) {
        return NextResponse.json({ message: "auth failed", status: 400 })
    }
}