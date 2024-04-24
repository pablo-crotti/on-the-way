import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from "@/lib/prisma";

import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
});

/**
 * Uploads a file to an AWS S3 bucket.
 * 
 * @param {File} file - The file to be uploaded.
 * @param {string} imgName - The name to be used for the uploaded image file.
 * @returns {Promise<string | AWS.AWSError>} - A Promise that resolves with the URL of the uploaded file on success, or an AWS error object on failure.
 *
 * @example
 * const file = /* File object * /;
 * const imgName = "example.jpg";
 * const imageUrl = await uploadFile(file, imgName);
 * if (typeof imageUrl === 'string') {
 *     console.log("File uploaded successfully. Image URL:", imageUrl);
 * } else {
 *     console.error("Error uploading file:", imageUrl);
 * }
 */
const uploadFile = async (file: File, imgName: String) => {
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    const params: AWS.S3.PutObjectRequest = {
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Key: `uploads/${imgName}`,
        Body: buffer,
        ContentType: file.type,
    };

    try {
        const data = await s3.upload(params).promise();
        return (data.Location);
    } catch (err) {
        return err;
    }
}

/**
 * Handles POST requests for creating a new collection in the database with associated files uploaded to AWS S3.
 * The function processes form data including images and documents, uploads them to S3, and stores references in the database.
 * It also manages creation of related characters with their images and descriptions.
 *
 * @param {NextRequest} request - The incoming HTTP request containing the form data.
 * @returns {NextResponse} - Returns a response indicating the outcome of the operation, such as successful creation or error messages.
 *
 * @example
 * // Sample FormData:
 * // {
 * //   title: "New Collection",
 * //   description: "Description of the collection",
 * //   illustration: File, // image file for the collection
 * //   document: File, // optional document file for the collection
 * //   places: ["Place1", "Place2"], // array of places
 * //   characterName0: "Character Name",
 * //   characterDescription0: ["Description1", "Description2"],
 * //   characterIllustration0: File // image file for the character
 * // }
 */
export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const file = formData.get('illustration') as File | null;
    const imgName = formData.get('imgName') as string;
    let uploadPath = '';
    if (file) {

        const illustrationUrl = await uploadFile(file, imgName);

        let documentUrl = null;
        if (illustrationUrl) {
            let documentName = "";
            if (formData.get('document') && formData.get("documentName")) {
                const document = formData.get('document') as File;
                documentName = formData.get('documentName') as string;

                documentUrl = await uploadFile(document, documentName);



                if (!documentUrl) {
                    return new NextResponse('Une erreur est survenue lors de l\'écriture du fichier', { status: 500 });
                }

            }

        } else {
            return new NextResponse('Une erreur est survenue lors de l\'écriture du fichier', { status: 500 });
        }

        const max = await prisma.collection.findFirst({
            select: {
                number: true
            },
            orderBy: {
                number: 'desc'
            }
        })

        let number: number | undefined;

        if (max) {
            number = max.number + 1;
        } else {
            number = 1;
        }

        const upload = await prisma.collection.create({
            data: {
                name: formData.get('title') as string,
                description: formData.get('description') as string,
                image: typeof illustrationUrl === 'string' ? illustrationUrl : '',
                number: number,
                places: formData.getAll('places') as string[],
                document: typeof documentUrl === 'string' ? documentUrl : undefined
            }
        });


        const uplodadId = upload.id;
        const indexSum = formData.get('indexSum');

        const indexSumValue = parseInt(indexSum as string);

        for (let i = 0; i < indexSumValue; i++) {

            if (formData.get(`characterIllustration${i}`) as File) {
                const illustration = formData.get(`characterIllustration${i}`) as File;
                const illustrationName = formData.get(`characterIllustrationName${i}`) as string;

                const illustrationUrl = await uploadFile(illustration, illustrationName);

                if (!illustrationUrl) {
                    return new NextResponse('Une erreur est survenue lors de l\'écriture du fichier', { status: 500 });
                }

                const uploadCharacter = await prisma.character.create({
                    data: {
                        name: formData.get(`characterName${i}`) as string,
                        description: formData.getAll(`characterDescription${i}`) as string[],
                        image: typeof illustrationUrl === 'string' ? illustrationUrl : '',
                        collectionId: uplodadId
                    }
                });

            }

        }

        return new NextResponse(JSON.stringify(upload), { status: 200 });
    } else {
        return new NextResponse('Une erreur est survenue lors de l\'écriture du fichier', { status: 500 });
    }
}

/**
 * Handles GET requests to fetch collections from the database. It can retrieve a single collection by its ID or number,
 * or it can retrieve all collections. The response includes detailed collection data.
 *
 * @param {NextRequest} request - The incoming HTTP request with search parameters specifying which collection(s) to fetch.
 * @returns {NextResponse} - A response object containing the requested collection data in JSON format, or an error message.
 *
 * @example
 * // Fetch a single collection by number:
 * // GET /api/collection?number=1
 *
 * // Fetch a single collection by ID:
 * // GET /api/collection?id=abc123
 *
 * // Fetch all collections:
 * // GET /api/collection?all=true
 */
export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const number = params.get('number');
    const id = params.get('id');
    const all = params.get('all');

    if (number) {
        const collection = await prisma.collection.findFirst({
            where: {
                number: parseInt(number)
            }
        });

        return new NextResponse(JSON.stringify(collection), { status: 200 });
    } else if (id) {
        const collection = await prisma.collection.findFirst({
            where: {
                id: id
            }
        });

        return new NextResponse(JSON.stringify(collection), { status: 200 });

    } else if (all) {
        const collection = await prisma.collection.findMany({
            orderBy: {
                number: 'desc'
            }
        });

        return new NextResponse(JSON.stringify(collection), { status: 200 });

    } else {
        const collection = await prisma.collection.findFirst({
            orderBy: {
                number: 'desc'
            }
        })

        return new NextResponse(JSON.stringify(collection), { status: 200 });
    }

}