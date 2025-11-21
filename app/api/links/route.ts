import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { generateRandomCode, isValidCode, isValidUrl, normalizeUrl } from "@/lib/validators";
import type { Link } from "@/app/types/link";

// GET /api/links  → list all links
export async function GET() {
  try {
    const result = await pool.query<Link>("SELECT * FROM links ORDER BY created_at DESC");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching links", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/links  → create link
export async function POST(req: Request) {
  try {
    const { url, code: providedCode } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!isValidUrl(url)) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const normalizedUrl = normalizeUrl(url);

    let code = providedCode as string | undefined;

    if (code) {
      if (!isValidCode(code)) {
        return NextResponse.json(
          { error: "Code must match [A-Za-z0-9]{6,8}" },
          { status: 400 }
        );
      }
    } else {
      code = await generateUniqueCode();
    }

    const existing = await pool.query("SELECT id FROM links WHERE code = $1", [code]);
    if (existing.rowCount > 0) {
      return NextResponse.json({ error: "Code already exists" }, { status: 409 });
    }

    const insert = await pool.query<Link>(
      "INSERT INTO links (code, url) VALUES ($1, $2) RETURNING *",
      [code, normalizedUrl]
    );

    return NextResponse.json(insert.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating link", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function generateUniqueCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const candidate = generateRandomCode(6);
    const existing = await pool.query("SELECT id FROM links WHERE code = $1", [candidate]);

    if (existing.rowCount === 0) return candidate;
  }
  return generateRandomCode(8);
}
