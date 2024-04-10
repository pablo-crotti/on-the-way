import { NextRequest, NextResponse } from 'next/server'
import cookie from 'cookie'

export async function POST(request : NextRequest, response : NextResponse) {
    
    const formData = await request.formData();

    console.log(formData)

    const cookie_name = formData.get("name");
    const cookie_value = formData.get("value");
    const cookie_expiration = formData.get("expiration");

    if (!cookie_name || !cookie_value) {
        return new Response("Missing name or value", { status: 400 });
    }

    cookie.serialize(String(cookie_name), String(cookie_value), {
        httpOnly: true,
        secure: true,
        path: "/",
    });

    return new Response("Cookie set");

    
   
}

export async function GET(request : NextRequest) {
    console.log(cookie.parse("podbean_token"))
    const cookies = cookie.parse("podbean_token");

    return new Response(JSON.stringify(cookies));
}