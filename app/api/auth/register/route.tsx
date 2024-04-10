import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import {useRouter} from "next/navigation";

const router = useRouter();

export async function GET(request : NextRequest) {
    const token = new URL(request.url).searchParams.get("token")
    console.log(1)
    const user = await prisma.user.findFirst({
        where: {
            token: `${token}`
        }
    });

    console.log(user)

    if (!user) {
        console.log("User not found")
        router.replace("/signin");
        return new Response("User not found", { status: 404 });
    }

   return NextResponse.json(user)
}

export async function PUT(request : NextRequest) {
    const formData = await request.formData();
    const id = formData.get("id");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (!password) {
        return new Response("Password is required", { status: 400 });
    }

    if (password !== confirmPassword) {
        return new Response("Les mots de passe ne sont pas identiques", { status: 400 });
    }

    const passwordString = password as string;
    if (passwordString.length < 8) {
        return new Response("Le mot de passe doit contenir au moins 8 caractères", { status: 400 });
    }

    if (passwordString.length > 50) {
        return new Response("Le mot de passe doit contenir au maximum 50 caractères", { status: 400 });
    }

    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialChar.test(password as string)) {
        return new Response("Le mot de passe doit contenir au moins un caractère spécial", { status: 400 });
    }

    const number = /[0-9]/;
    if (!number.test(password as string)) {
        return new Response("Le mot de passe doit contenir au moins un chiffre", { status: 400 });
    }

    const upperCase = /[A-Z]/;
    if (!upperCase.test(password as string)) {
        return new Response("Le mot de passe doit contenir au moins une lettre majuscule", { status: 400 });
    }

    if (id === null) {
        return new Response("Id not found", { status: 404 });
    }

    const hashPassword = await bcrypt.hash(password as string, 10);

    const user = await prisma.user.update({
        where: {
            id: `${id}`
        },
        data: {
            password: hashPassword,
            token: ''
        }
    });

    

    return new Response("Password updated", { status: 200 });

}