import { NextResponse } from "next/server";

// Demo data jo pehle se dikhega
let projects = [
  { id: 1, name: "Database Setup", description: "Aiven Cloud connection done.", status: "Completed" },
  { id: 2, name: "UI Enhancement", description: "Making the dashboard responsive.", status: "In Progress" }
];

export async function GET() {
  return NextResponse.json(projects);
}

export async function POST(req) {
  try {
    const { name, description } = await req.json();
    const newProject = { 
      id: Date.now(), // Unique ID for every new project
      name, 
      description, 
      status: "In Progress" 
    };
    projects = [newProject, ...projects]; // Naya project sabse upar add hoga
    return NextResponse.json(newProject);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}
