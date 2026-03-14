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

// Ye function apne aap table bana dega agar nahi hogi toh
async function ensureTableExists(connection) {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            status ENUM('In Progress', 'Completed') DEFAULT 'In Progress'
        );
    `;
    await connection.execute(createTableQuery);
}

export async function GET() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        await ensureTableExists(connection); // Table check karega
        const [rows] = await connection.execute('SELECT * FROM projects');
        await connection.end();
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { name, description } = await req.json();
        const connection = await mysql.createConnection(dbConfig);
        await ensureTableExists(connection); // Table check karega
        const [result] = await connection.execute(
            'INSERT INTO projects (name, description, status) VALUES (?, ?, ?)',
            [name, description, 'In Progress']
        );
        await connection.end();
        return NextResponse.json({ id: result.insertId, name, description, status: 'In Progress' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { id, status } = await req.json();
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE projects SET status = ? WHERE id = ?',
            [status, id]
        );
        await connection.end();
        return NextResponse.json({ message: "Status Updated Successfully!" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
