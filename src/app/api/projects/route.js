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

async function executeQuery(query, params = []) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } finally {
    await connection.end();
  }
}

export async function GET() {
  try {
    // Pehle table check karlo
    await executeQuery(`CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'In Progress'
    )`);
    const data = await executeQuery("SELECT * FROM projects ORDER BY id DESC");
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, description } = await req.json();
    const res = await executeQuery(
      "INSERT INTO projects (name, description) VALUES (?, ?)",
      [name, description]
    );
    return NextResponse.json({ id: res.insertId, name, description, status: 'In Progress' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
