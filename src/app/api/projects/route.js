import { NextResponse } from "next/server";

// Sample projects jo hamesha dikhenge
let demoProjects = [
    { id: 1, name: "ERP System", description: "Old management project", status: "Completed" },
    { id: 2, name: "Portfolio Website", description: "Personal branding site", status: "In Progress" }
];

export async function GET() {
    return NextResponse.json(demoProjects);
}

export async function POST(req) {
    const { name, description } = await req.json();
    const newProject = { id: Date.now(), name, description, status: "In Progress" };
    demoProjects.unshift(newProject);
    return NextResponse.json(newProject);
}
