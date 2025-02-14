import { NextRequest, NextResponse } from "next/server"

import { db } from "@/db/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

import axios from "axios"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Überprüfe, ob die 'data' Base64-kodiert ist und dekodiere sie
        const base64Data = body?.message?.data;
        if (base64Data) {
            const buffer = Buffer.from(base64Data, 'base64');
            const decoded = JSON.parse(buffer.toString());
            console.log("pub sub decoded ---> ",decoded)
            const historyID = decoded.historyId
            const eventSourceUrl = "https://0ec3c8da7ca8.ngrok.app/api"; // Der SSE-Endpoint
            await fetch(eventSourceUrl, {
              method: "POST",
              body: JSON.stringify({ historyID }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            
        } else {
            console.log("No Base64 data found.");
        }
        
        return NextResponse.json({ message: "Success", status: "200" });
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json({ message: "Failed", status: "400" });
    }
}