import { NextRequest, NextResponse } from "next/server"

import axios from "axios"

export async function POST(request: NextRequest) {
    try {
        const authToken = request.cookies.get('auth_token');

        if (!authToken) {
            console.log("No auth token found !");
            return NextResponse.json({ message: 'No auth token or email found' }, { status: 401 });
        }

        const stringToken = authToken.value;
        try {
            const response = await axios.post(
              "https://gmail.googleapis.com/gmail/v1/users/me/watch",
              {
                labelIds: ["INBOX", "UNREAD"],  // Überwache nur das INBOX-Label
                topicName: "projects/the-boring-cloud-450516/topics/SaaSTopic",  // Das Topic, das du verwenden möchtest
              },
              {
                headers: {
                  Authorization: `Bearer ${stringToken}`,  // Bearer Token für Authentifizierung
                },
              }
            );
        
            console.log("Watch request successful:", response.data);
            return NextResponse.json({ message: "Watch request successful", data: response.data });
          } catch (err) {
            console.error("Error in Watch request:", err);
            return NextResponse.json({ message: "Failed to create watch request", status: "500" });
          }
    } catch (err) {}
}