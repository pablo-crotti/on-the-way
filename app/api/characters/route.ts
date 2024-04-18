import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const collection = params.get('collection');

    if (!collection) {
        return new Response('Collection not found', { status: 400 });
    }

    const characters = await prisma.character.findMany({
        where: {
            collectionId: collection
        }
    });
    
    return new Response(JSON.stringify(characters), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
}