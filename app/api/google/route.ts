// import { BetaAnalyticsDataClient } from "@google-analytics/data";
// import { NextResponse } from "next/server";

// const propertyId = process.env.GA_PROPERTY_ID;

// const analyticsDataClient = new BetaAnalyticsDataClient({
//     credentials: {
//         client_email: process.env.GA_CLIENT_EMAIL,
//         private_key: process.env.GA_PRIVATE_KEY,
//     },
// });

// export async function GET() {
//     const [response] = await analyticsDataClient.runReport({
//         property: `properties/${propertyId}`,
//         dateRanges: [
//           {
//             startDate: '2020-03-31',
//             endDate: 'today',
//           },
//         ],
//         dimensions: [
//           {
//             name: 'city',
//           },
//         ],
//         metrics: [
//           {
//             name: 'activeUsers',
//           },
//         ],
//       });
//     return NextResponse.json(response);
// }