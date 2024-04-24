import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
const nodemailer = require("nodemailer");
import bcrypt from "bcrypt";

/**
 * Handles the POST request to register a new user. This function verifies that the provided email addresses match,
 * creates a new user in the database with a hashed token, and sends a verification email to the user.
 *
 * @param {NextRequest} request - The incoming HTTP request containing the form data with the user's email.
 * @returns {NextResponse} - A response object indicating the result of the operation. It can either confirm that
 * the email has been sent, or it can return an error status if emails do not match, if there is an issue saving the user,
 * or if sending the email fails.
 *
 * @example
 * // Sample form data for the POST request:
 * // FormData: {
 * //   email: "user@example.com",
 * //   confirmEmail: "user@example.com"
 * // }
 *
 * // Success response:
 * // HTTP/1.1 200 OK
 * // "Email sent"
 *
 * // Failure response (email mismatch):
 * // HTTP/1.1 400 Bad Request
 * // "Emails don't match"
 *
 * // Failure response (email send failure):
 * // HTTP/1.1 500 Internal Server Error
 * // "Error sending email"
 */
export async function POST(request: NextRequest) {
  const username = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  const formData = await request.formData();
  const email = formData.get("email");
  const confirmEmail = formData.get("confirmEmail");

  if (email !== confirmEmail) {
    return new Response("Emails don't match", { status: 400 });
  }

  const token = await bcrypt.hash(`${email}`, 10);

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
      from: '"On the way" <noreply@ontheway-podcast.ch>',
      to: email,
      subject: "Bienvenue dans l'équipe On the way !",
      text: "Bienvenue dans l'équipe On the way !",
      html:
        "<strong>Bienvenue dans l'équipe On the way !</strong><p>Pour finaliser votre inscription, veuillez vous connecter via ce lien : </p><a href='http://localhost:3000/confirm?token=" +
        token +
        "'>Confirmer mon inscription</a>",
    });

    return new Response("Email sent", { status: 200 });
  } catch (error) {
    return new Response("Error sending email", { status: 500 });
  }
}
