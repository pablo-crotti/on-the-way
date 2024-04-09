import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
const nodemailer = require("nodemailer");
import bcrypt from "bcrypt";



export async function POST(request: NextRequest) {
    const username = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;

    const formData = await request.formData();
    const email = formData.get("email");
    const confirmEmail = formData.get("confirmEmail");

    if (email !== confirmEmail) {
        return new Response("Emails don't match", { status: 400 });
    }

    const token = await bcrypt.hash(`${email}` , 10);

    const user = await prisma.user.create({
        data: {
            email: `${email}`,
            token: token,
        },
    });

    

    const transporter = nodemailer.createTransport({
        host: "mail.smtp2go.com",
        port: 2525,
        secure: false,
        auth: {
            user: username,
            pass: password,
        },
    });
    try {
        const mail = await transporter.sendMail({
        
            from: '"On the way" <pablo.crotti@heig-vd.ch>',
            to: email,
            subject: "Bienvenue dans l'équipe On the way !",
            text: "Bienvenue dans l'équipe On the way !",
            html: "<strong>Bienvenue dans l'équipe On the way !</strong><p>Pour finaliser votre inscription, nous vous veuillez vous connecter via ce lien : </p><a href='http://localhost:3000/signup/confirm?token="+token+"'>Confirmer mon inscription</a>",
        }); 


        return new Response("Email sent", { status: 200 });
    } catch (error) {
        return new Response("Error sending email", { status: 500 });
    }
}
