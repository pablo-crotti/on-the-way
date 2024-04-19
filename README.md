This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
# on-the-way





# On The Way Podcast Platform

## Project overview
"On The Way" is a podcast platform developed for the city of Yverdon as part of the integration project at the Haute Ecole d'Ingénierie et de Gestion du Canton de Vaud, media engineering track. The platform facilitates communication between the city and its residents through multimedia content.

## Key features

### Admin Part
Administrators from the city have access to a variety of tools designed to manage and distribute podcast content effectively:
- **Season management:** Create and manage seasons with comprehensive details including title, description, characters involved, locations, related documents, and thematic images.
- **Episode publishing:** Episodes are published and managed through integration with the Podbean API, allowing seamless podcast distribution.
- **User management:** Admins can add users, initiate password setups via email, and manage roles within the platform.
- **Analytics dashboard:** View detailed statistics on episode listens and website visits to gauge audience engagement.
- **Message Center:** Review and respond to messages from users, categorized by queries such as comments, questions, or partnership requests.

### User Part
The public interface allows users to:
- **Explore content:** View available podcast series and episodes.
- **Media playback:** Listen to episodes directly on the platform.
- **EEngagement:** Contact the creators with feedback or questions through an integrated messaging system.

## Technical architecture

### Database integration
The platform utilizes Vercel for hosting and directly interacts with a PostgreSQL database configured through Vercel environment variables. This setup ensures streamlined deployment and management processes, aligning with modern cloud architecture practices.

### Data models
The application employs Prisma as its ORM, facilitating effective database management with the following models:
- **User:** Manages user information, including authentication tokens and admin roles.
- **Message:** Stores messages from users with categories for filtering and organization.
- **ApiToken:** Handles API token generation and expiration for secure access.
- **Collection:** Represents a collection of podcast series, each with unique attributes like description and associated media.
- **Character:** Details characters featured within the podcast series, linked to specific collections.

## Environment variables

## Setup instructions

```bash
git clone https://github.com/WinnieTheBloue/on-the-way.git
cd on-the-way
npm install