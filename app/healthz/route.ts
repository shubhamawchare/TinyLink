import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

const startTime = Date.now();

export async function GET() {
  try {
    // optional check DB
    await pool.query('SELECT 1');

    const uptimeSeconds = Math.round(process.uptime());

    return NextResponse.json(
      {
        ok: true,
        version: '1.0',
        uptime: uptimeSeconds,
        startedAt: new Date(startTime).toISOString(),
        now: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Healthcheck error', error);
    return NextResponse.json(
      { ok: false, error: 'DB connection failed' },
      { status: 500 }
    );
  }
}
