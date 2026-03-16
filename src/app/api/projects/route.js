import { NextResponse } from "next/server";

// Sample projects jo hamesha dikhenge
let demoProjects = [
    { id: 1, name: "Project Alpha", description: "Backend optimization and API setup.", status: "Completed" },
    { id: 2, name: "Project Beta", description: "Frontend UI/UX redesign using Tailwind.", status: "In Progress" },
    { id: 3, name: "Database Migration", description: "Moving local data to Aiven Cloud.", status: "In Progress" }
];

export async function GET() {
    return NextResponse.json(demoProjects);
}

export async function POST(req) {
    try {
        const { name, description } = await req.json();
        const newProject = { 
            id: Date.now(), 
            name, 
            description, 
            status: "In Progress" 
        };
        demoProjects.unshift(newProject);
        return NextResponse.json(newProject);
    } catch (error) {
        return NextResponse.json({ error: "Failed to add project" }, { status: 500 });
    }
}
