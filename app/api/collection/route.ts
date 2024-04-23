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

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const file = formData.get('illustration') as File | null;
    const imgName = formData.get('imgName') as string;
    let uploadPath = '';
    if (file) {

        const illustrationUrl = await uploadFile(file, imgName);
        return new NextResponse(JSON.stringify(illustrationUrl), { status: 500 });
        
        
        // let documentUrl = null;
        // if (illustrationUrl) {
        //     let documentName = "";
        //     if (formData.get('document') && formData.get("documentName")) {
        //         const document = formData.get('document') as File;
        //         documentName = formData.get('documentName') as string;

        //         documentUrl = await uploadFile(document, documentName);

                

        //         if (!documentUrl) {
        //             return new NextResponse('Une erreur est survenue lors de l\'écriture du fichier', { status: 500 });
        //         }

        //     }

        // } else {
            
        //     return new NextResponse('Une erreur est survenue lors de l\'écriture du fichier', { status: 500 });
        // }

        // const max = await prisma.collection.findFirst({
        //     select: {
        //         number: true
        //     },
        //     orderBy: {
        //         number: 'desc'
        //     }
        // })

        // let number: number | undefined;

        // if (max) {
        //     number = max.number + 1;
        // } else {
        //     number = 1;
        // }

        // const upload = await prisma.collection.create({
        //     data: {
        //         name: formData.get('title') as string,
        //         description: formData.get('description') as string,
        //         image: typeof illustrationUrl === 'string' ? illustrationUrl : '',
        //         number: number,
        //         places: formData.getAll('places') as string[],
        //         document: typeof documentUrl === 'string' ? documentUrl : undefined
        //     }
        // });


        // const uplodadId = upload.id;
        // const indexSum = formData.get('indexSum');

        // const indexSumValue = parseInt(indexSum as string);

        // for (let i = 0; i < indexSumValue; i++) {

        //     if (formData.get(`characterIllustration${i}`) as File) {
        //         const illustration = formData.get(`characterIllustration${i}`) as File;
        //         const illustrationName = formData.get(`characterIllustrationName${i}`) as string;

        //         const illustrationUrl = await uploadFile(illustration, illustrationName);

        //         if (!illustrationUrl) {
        //             return new NextResponse('Une erreur est survenue lors de l\'écriture du fichier', { status: 500 });
        //         } 

        //         const uploadCharacter = await prisma.character.create({
        //             data: {
        //                 name: formData.get(`characterName${i}`) as string,
        //                 description: formData.getAll(`characterDescription${i}`) as string[],
        //                 image: typeof illustrationUrl === 'string' ? illustrationUrl : '',
        //                 collectionId: uplodadId
        //             }
        //         });

        //     }

        // }

        // return new NextResponse(JSON.stringify(upload), { status: 200 });
    } else {
        return new NextResponse('Une erreur est survenue lors de l\'écriture du fichier', { status: 500 });
    }
}
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