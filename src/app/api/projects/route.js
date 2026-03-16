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

async function initDB() {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            status ENUM('In Progress', 'Completed') DEFAULT 'In Progress'
        )
    `);
    await connection.end();
}

export async function GET() {
    try {
        await initDB();
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM projects ORDER BY id DESC');
        await connection.end();
        return NextResponse.json(rows);
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(req) {
    try {
        const { name, description } = await req.json();
        await initDB();
        const connection = await mysql.createConnection(dbConfig);
        const [res] = await connection.execute(
            'INSERT INTO projects (name, description) VALUES (?, ?)', 
            [name, description]
        );
        await connection.end();
        return NextResponse.json({ id: res.insertId, name, description, status: 'In Progress' });
    } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
