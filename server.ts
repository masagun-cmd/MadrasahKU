import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import twilio from "twilio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Twilio Setup
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Google Sheets API Setup
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Send WhatsApp Notification
  app.post("/api/notifications/whatsapp", async (req, res) => {
    const { to, message } = req.body;

    if (!twilioClient) {
      console.warn("Twilio not configured. Skipping WhatsApp notification.");
      return res.status(200).json({ success: true, message: "Twilio not configured (Mock Success)" });
    }

    try {
      const response = await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886",
        to: `whatsapp:${to}`,
        body: message,
      });
      res.json({ success: true, sid: response.sid });
    } catch (error: any) {
      console.error("Twilio Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Mock Auth for Demo (In real app, this would check Google Sheets or Auth provider)
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    // Simple mock logic
    if (username === "admin" && password === "admin") {
      res.json({ user: { id: "1", name: "Admin Madrasah", role: "admin" } });
    } else if (username === "guru" && password === "guru") {
      res.json({ user: { id: "2", name: "Ustadz Ahmad", role: "guru" } });
    } else if (username === "wali" && password === "wali") {
      res.json({ user: { id: "3", name: "Bpk. Budi", role: "wali" } });
    } else if (username === "siswa" && password === "siswa") {
      res.json({ user: { id: "4", name: "Fulan", role: "siswa" } });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  // Example Google Sheets Read
  app.get("/api/data/:sheetName", async (req, res) => {
    if (!SPREADSHEET_ID) {
      return res.status(500).json({ message: "Google Sheets ID not configured" });
    }
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${req.params.sheetName}!A:Z`,
      });
      res.json(response.data.values);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
