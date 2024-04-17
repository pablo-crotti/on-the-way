import { NextRequest, NextResponse } from "next/server";

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