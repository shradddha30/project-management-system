import { NextResponse } from 'next/server';

export async function POST(request) {
    const { username, password } = await request.json();
    if (username === 'admin' && password === 'admin123') {
        const response = NextResponse.json({ message: "Success" });
        response.cookies.set('isLoggedIn', 'true', { 
            httpOnly: false, // UI se access karne ke liye false rakha hai
            path: '/',
            maxAge: 60 * 60 * 24 // 1 din
        });
        return response;
    }
    return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
}