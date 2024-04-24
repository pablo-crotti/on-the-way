import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Handles a POST request to update the API token in the database. This function deletes any existing tokens and
 * creates a new token with the provided expiration. It requires both 'token' and 'expires' fields to be present in
 * the form data. Responses indicate whether the operation was successful or if errors occurred during the process.
 *
 * @param {NextRequest} request - The incoming HTTP request containing the form data with the token and expiration.
 * @returns {Response} - A response object indicating the result of the operation, with a status code and a message.
 *
 * @example
 * // Expected FormData:
 * // token="new_token_value", expires="2023-12-31T23:59:59Z"
 *
 * // Successful response:
 * // HTTP/1.1 200 OK
 * // "Token created"
 *
 * // Failure response (missing token or expires):
 * // HTTP/1.1 400 Bad Request
 * // "Token is required"
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const token = formData.get("token");
  const expires = formData.get("expires");

  if (!token) {
    return new Response("Token is required", { status: 400 });
  }

  if (!expires) {
    return new Response("Expiration is required", { status: 400 });
  }
  const deleteTokens = await prisma.apitoken.deleteMany();
  if (!deleteTokens) {
    return new Response("Tokens not deleted", { status: 500 });
  }

  const tokenRecord = await prisma.apitoken.create({
    data: {
      token: token.toString(),
      expiration: expires.toString(),
    },
  });

  if (!tokenRecord) {
    return new Response("Token not created", { status: 500 });
  }

  return new Response("Token created", { status: 200 });
}

/**
 * Handles a GET request to retrieve the current API token from the database. If no token is found, it returns
 * a 404 error response. Otherwise, it returns the token data in JSON format.
 *
 * @param {NextRequest} request - The incoming HTTP request.
 * @returns {Response} - A response object containing the token data or an error message, with a corresponding status code.
 *
 * @example
 * // Successful retrieval response:
 * // HTTP/1.1 200 OK
 * // { "token": "some_token_value", "expiration": "2023-12-31T23:59:59Z" }
 *
 * // Failure response (no tokens found):
 * // HTTP/1.1 404 Not Found
 * // "No tokens found"
 */
export async function GET(request: NextRequest) {
  const tokens = await prisma.apitoken.findFirst();
  if (!tokens) {
    return new Response("No tokens found", { status: 404 });
  }

  return new Response(JSON.stringify(tokens), { status: 200 });
}
