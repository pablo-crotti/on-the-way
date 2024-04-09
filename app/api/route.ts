import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const session = await getServerSession();
    return NextResponse.json({ authenticated: !!session})
}
