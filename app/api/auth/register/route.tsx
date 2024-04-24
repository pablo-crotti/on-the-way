import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

/**
 * Handles a GET request to verify a user based on a token provided via the query parameters.
 * Retrieves the user from the database using the token. If the user does not exist, it returns a 404 error.
 *
 * @param {NextRequest} request - The incoming request object from Next.js, containing the URL and query params.
 * @returns {NextResponse | Response} - Returns a JSON response with the user data if found, otherwise an error message.
 *
 * @example
 * // Example URL: /api/auth/register?token=abc123
 */
export async function GET(request: NextRequest) {
  const token = new URL(request.url).searchParams.get("token");
  const user = await prisma.user.findFirst({
    where: {
      token: `${token}`,
    },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  return NextResponse.json(user);
}

/**
 * Handles a PUT request to update a user's password. Validates the new password against certain criteria
 * such as length, presence of special characters, numbers, and uppercase letters. If any criteria are not met,
 * the function returns an appropriate error response. If successful, it updates the user's password in the database.
 *
 * @param {NextRequest} request - The incoming request object containing the form data with the new password
 *                                and its confirmation.
 * @returns {Response} - Returns a response indicating whether the password was successfully updated or details any errors encountered.
 *
 * @example
 * // Form Data: {
 * //   id: "user_id",
 * //   password: "NewPass123!",
 * //   confirmPassword: "NewPass123!"
 * // }
 *
 * // Success response:
 * // HTTP/1.1 200 OK
 * // "Password updated"
 *
 * // Failure response (passwords don't match):
 * // HTTP/1.1 400 Bad Request
 * // "Les mots de passe ne sont pas identiques"
 */
export async function PUT(request: NextRequest) {
  const formData = await request.formData();
  const id = formData.get("id");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!password) {
    return new Response("Password is required", { status: 400 });
  }

  if (password !== confirmPassword) {
    return new Response("Les mots de passe ne sont pas identiques", {
      status: 400,
    });
  }

  const passwordString = password as string;
  if (passwordString.length < 8) {
    return new Response("Le mot de passe doit contenir au moins 8 caractères", {
      status: 400,
    });
  }

  if (passwordString.length > 50) {
    return new Response(
      "Le mot de passe doit contenir au maximum 50 caractères",
      { status: 400 }
    );
  }

  const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialChar.test(password as string)) {
    return new Response(
      "Le mot de passe doit contenir au moins un caractère spécial",
      { status: 400 }
    );
  }

  const number = /[0-9]/;
  if (!number.test(password as string)) {
    return new Response("Le mot de passe doit contenir au moins un chiffre", {
      status: 400,
    });
  }

  const upperCase = /[A-Z]/;
  if (!upperCase.test(password as string)) {
    return new Response(
      "Le mot de passe doit contenir au moins une lettre majuscule",
      { status: 400 }
    );
  }

  if (id === null) {
    return new Response("Id not found", { status: 404 });
  }

  const hashPassword = await bcrypt.hash(password as string, 10);

  const user = await prisma.user.update({
    where: {
      id: `${id}`,
    },
    data: {
      password: hashPassword,
      token: "",
    },
  });

  return new Response("Password updated", { status: 200 });
}
