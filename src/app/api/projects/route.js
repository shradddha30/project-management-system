import { NextResponse } from "next/server";

// Fake data taaki turant dikhne lage
let tempProjects = [
    { id: 1, name: "Sample Project", description: "This is working now!", status: "In Progress" }
];

export async function GET() {
    return NextResponse.json(tempProjects);
}

export async function POST(req) {
    const { name, description } = await req.json();
    const newProject = { 
        id: tempProjects.length + 1, 
        name, 
        description, 
        status: "In Progress" 
    };
    tempProjects.push(newProject);
    return NextResponse.json(newProject);
}

export async function PUT(req) {
    const { id, status } = await req.json();
    tempProjects = tempProjects.map(p => p.id === id ? { ...p, status } : p);
    return NextResponse.json({ message: "Updated" });
}
