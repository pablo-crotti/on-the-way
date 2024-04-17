import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const file = formData.get('illustration') as File | null;
    const imgName = formData.get('imgName') as string;
    let uploadPath = '';
    if (file) {
        const fileBuffer = await file.arrayBuffer();
        uploadPath = path.join(process.cwd(), 'public', 'illustrations', imgName);
        

        try {
            await fs.promises.writeFile(uploadPath, Buffer.from(fileBuffer));
            uploadPath = ''
            let documentName = "";
            if(formData.get('document') && formData.get("documentName")) {
                const document = formData.get('document') as File;
                documentName = formData.get('documentName') as string;
                const documentBuffer = await document.arrayBuffer();
                const documentPath = path.join(process.cwd(), 'public', 'documents', documentName);

                try {
                    await fs.promises.writeFile(documentPath, Buffer.from(documentBuffer));
                } catch (err) {
                    console.error('Erreur lors de l\'écriture du fichier :', err);
                    return new NextResponse('Une erreur est survenue lors de l\'écriture du fichier', { status: 500 });
                }
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
                    image: imgName,
                    number: number,
                    places: formData.getAll('places') as string[],
                    document: documentName
                }
            });

            const uplodadId = upload.id;
            const indexSum = formData.get('indexSum');



            const indexSumValue = parseInt(indexSum as string);

            for (let i = 0; i < indexSumValue; i++) {
                uploadPath = '';
                if (formData.get(`characterIllustration${i}`) as File) {
                    const illustration = formData.get(`characterIllustration${i}`) as File;
                    const fileBuffer = await illustration.arrayBuffer();
                    uploadPath = path.join(process.cwd(), 'public', 'illustrations', illustration.name);
                    try {
                        await fs.promises.writeFile(uploadPath, Buffer.from(fileBuffer));
                    } catch (err) {
                        console.error('Erreur lors de l\'écriture du fichier :', err);
                        return new NextResponse('Une erreur est survenue lors de l\'écriture du fichier', { status: 500 });
                    }

                    const uploadCharacter = await prisma.character.create({
                        data: {
                            name: formData.get(`characterName${i}`) as string,
                            description: formData.getAll(`characterDescription${i}`) as string[],
                            image: illustration.name,
                            collectionId: uplodadId
                        }
                    });
                }
            }

            return new NextResponse(JSON.stringify(upload), { status: 200 });

        } catch (err) {
            console.error('Erreur lors de l\'écriture du fichier :', err);
            return new NextResponse('Une erreur est survenue lors de l\'écriture du fichier', { status: 500 });
        }
    } else {
        console.error('Aucun fichier trouvé dans la requête.');
        return new NextResponse('Aucun fichier trouvé dans la requête.', { status: 400 });
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