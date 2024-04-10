import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const email = formData.get('email');
    const category = formData.get('category');
    const object = formData.get('object');
    const text = formData.get('message');

    if (!email || !category || !object || !text) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    try {
        await prisma.message.create({
            data: {
                sender: email as string,
                category: category as Category,
                object: object as string,
                text: text as string
            }
        });
        return NextResponse.json({ message: 'Message sent' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'An error occured' }, { status: 500 });
    }
}   