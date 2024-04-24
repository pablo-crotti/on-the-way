import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Handles a GET request to retrieve characters belonging to a specified collection. The collection identifier
 * is expected to be provided as a query parameter. This function queries the database for all characters associated
 * with the given collection ID and returns them in JSON format. If the collection ID is not provided or no characters
 * are found for that collection, it returns an appropriate error response.
 *
 * @param {NextRequest} request - The incoming HTTP request from Next.js containing the URL and search parameters.
 * @returns {Response} - A response object containing the characters data in JSON format if successful, or an error message.
 *
 * @example
 * // Sample request URL:
 * // /api/characters?collection=12345
 *
 * // Successful response:
 * // HTTP/1.1 200 OK
 * // Content-Type: application/json
 * // [
 * //   { "id": "1", "name": "John Doe", "collectionId": "12345", ... },
 * //   { "id": "2", "name": "Jane Doe", "collectionId": "12345", ... }
 * // ]
 *
 * // Failure response (collection ID not provided):
 * // HTTP/1.1 400 Bad Request
 * // "Collection not found"
 */
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