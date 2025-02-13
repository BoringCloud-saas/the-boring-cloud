import { NextRequest, NextResponse } from "next/server";

let historyID: string | null = null;

// CORS-Header hinzufügen
const setCorsHeaders = (res: NextResponse) => {
  res.headers.set("Access-Control-Allow-Origin", "*"); // Erlaubt alle Ursprünge
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Erlaubte Methoden
  res.headers.set("Access-Control-Allow-Headers", "Content-Type"); // Erlaubte Header
  return res;
};

// POST-Anfrage: Speichern der historyID
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.historyID) {
      historyID = body.historyID;
      console.log("Empfangene historyID:", historyID);
    }

    return setCorsHeaders(NextResponse.json({ message: "Success", status: "200" }));
  } catch (error) {
    console.error("Fehler beim Verarbeiten der Anfrage:", error);
    return setCorsHeaders(NextResponse.json({ message: "Failed", status: "400" }));
  }
}