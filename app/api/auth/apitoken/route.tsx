import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const token = formData.get("token");
    const expires = formData.get("expires");


    if (!token) {
        return new Response("Token is required", { status: 400 });
    }

    if (!expires) {
        return new Response("Expiration is required", { status: 400 });
    }
    const deleteTokens = await prisma.apitoken.deleteMany();
    if (!deleteTokens) {
        return new Response("Tokens not deleted", { status: 500 });
    }

   
    const tokenRecord = await prisma.apitoken.create({
        data: {
            token: token.toString(),
            expiration: expires.toString(), 
        },
    });

    if (!tokenRecord) {
        return new Response("Token not created", { status: 500 });
    }

    return new Response("Token created", { status: 200 });

}


export async function GET(request: NextRequest) {
    const tokens = await prisma.apitoken.findMany();

    if (!tokens) {
        return new Response("No tokens found", { status: 404 });
    }

    console.log(tokens);

    return new Response(JSON.stringify(tokens), { status: 200 });
}