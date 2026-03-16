import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: 'mysql-1c88827c-project-mgmt-shraddha.j.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_jFaJd1A1l0uHy6DzAkG',
  database: 'defaultdb',
  port: 11576,
  ssl: { rejectUnauthorized: false }
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM projects ORDER BY id DESC");
    await connection.end();
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, description } = await req.json();
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO projects (name, description, status) VALUES (?, ?, 'In Progress')",
      [name, description]
    );
    await connection.end();
    return NextResponse.json({ id: result.insertId, name, description, status: 'In Progress' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
