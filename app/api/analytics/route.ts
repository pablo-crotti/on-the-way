import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to fetch analytics data for a specified category and time range from Vercel's API.
 * The function reads parameters from the query string, constructs an API request with these parameters,
 * and sends it to the Vercel API with the necessary authorization headers. The response from Vercel is
 * then returned as JSON.
 *
 * @param {NextRequest} req - The incoming request object provided by Next.js, containing URL parameters.
 * @returns {NextResponse} - Returns a JSON response constructed from the data received from Vercel's API.
 *
 * @example
 * // Example URL request to this function
 * // /api/analytics?category=web_requests&from=2023-01-01&to=2023-01-31
 * 
 * // This would fetch data for the category 'web_requests' from January 1, 2023 to January 31, 2023.
 */
export async function GET(req: NextRequest) {
    const category = req.nextUrl.searchParams.get('category');
    const fromDateTime = req.nextUrl.searchParams.get('from');
    const toDateTime = req.nextUrl.searchParams.get('to');
    const result = await fetch(
        `https://vercel.com/api/web/insights/stats/${category}?environment=production&filter=%7B%7D&from=${fromDateTime}&limit=250&projectId=${process.env.VERCEL_PROJECT_ID}&teamId=${process.env.VERCEL_TEAM_ID}&to=${toDateTime}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
            }
        }
    );
    return NextResponse.json(await result.json());
}