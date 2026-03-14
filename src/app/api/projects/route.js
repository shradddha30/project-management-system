import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'project_managment_db'
};

export async function GET() {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM projects ORDER BY id DESC');
    await connection.end();
    return NextResponse.json(rows);
}

export async function POST(req) {
    const { name, description } = await req.json();
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('INSERT INTO projects (name, description, status) VALUES (?, ?, ?)', [name, description || '', 'In Progress']);
    await connection.end();
    return NextResponse.json({ message: "Added" });
}

export async function PUT(req) {
    const { id, status } = await req.json();
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('UPDATE projects SET status = ? WHERE id = ?', [status, id]);
    await connection.end();
    return NextResponse.json({ message: "Updated" });
}

export async function DELETE(req) {
    const id = new URL(req.url).searchParams.get('id');
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM projects WHERE id = ?', [id]);
    await connection.end();
    return NextResponse.json({ message: "Deleted" });
}