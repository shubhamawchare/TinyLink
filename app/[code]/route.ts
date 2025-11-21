import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(
  req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;

  const result = await pool.query(
    `UPDATE links
     SET click_count = click_count + 1,
         last_clicked_at = NOW()
     WHERE code = $1
     RETURNING url`,
    [code]
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.redirect(result.rows[0].url, { status: 302 });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;

  const result = await pool.query(
    'DELETE FROM links WHERE code = $1 RETURNING id',
    [code]
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}


