import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';

/**
 * Create a new message.
 * @param {NextRequest} request - The request object.
 * @returns {Promise<NextResponse>} A promise that resolves to the response.
 */
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

/**
 * Retrieve messages.
 * @param {NextRequest} request - The request object.
 * @returns {Promise<NextResponse>} A promise that resolves to the response.
 */
export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const total = params.get('total');
    const take = params.get('take');
    const skip = params.get('skip');
    const sort = params.get('sort');
    const orderBy = sort ? sort.split('-') : null;
    if (total) {
        const messages = await prisma.message.findMany({});
        return NextResponse.json(messages.length);
    } else {
        const messages = await prisma.message.findMany({
            take: take ? parseInt(take) : 8,
            skip: skip ? parseInt(skip) : 0,
            orderBy: orderBy ? {
                [orderBy[0]]: orderBy[1]
            } : {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(messages);
    }
}

/**
 * Update a message's favorite status.
 * @param {NextRequest} request - The request object.
 * @returns {Promise<NextResponse>} A promise that resolves to the response.
 */
export async function PUT(request: NextRequest) {
    const formData = await request.formData();
    const id = formData.get('id');
    const favorite = formData.get('favorite');

    if (!id) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    let fav = false;

    if (favorite == "true") {
        fav = true;
    } else if (favorite == "false") {
        fav = false;
    }

    try {
        const message = await prisma.message.update({
            where: {
                id: id as string
            },
            data: {
                isFavorite: fav
            }
        });
        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json({ error: 'An error occured' }, { status: 500 });
    }
}

/**
 * Delete one or more messages.
 * @param {NextRequest} request - The request object.
 * @returns {Promise<NextResponse>} A promise that resolves to the response.
 */
export async function DELETE(request: NextRequest) {
    const idsToDelete = await request.json();
    if (!idsToDelete) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const idsArray = Array.isArray(idsToDelete) ? idsToDelete.map(id => id.toString()) : [idsToDelete.toString()];

    try {
        await prisma.message.deleteMany({
            where: {
                id: { in: idsArray }
            }
        });
        return NextResponse.json({ message: 'Message deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'An error occured' }, { status: 500 });
    }
}