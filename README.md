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


> **_NOTE:_**  The note content.
### ApiToken model explanation

The ApiToken model in the database serves as a mechanism to efficiently manage API tokens used for external services like Podbean. Here's the rationale and functionality of this model:

- **Token storage and management:** The ApiToken model stores tokens along with their expiration dates. This avoids the need to request a new token from the Podbean API with each fetch operation, minimizing request overhead and potential delays.
- **Expiration handling:** Each stored token includes an expiration attribute. To ensure continuity and minimize the risk of token expiration during an operation, the system subtracts one minute from the actual expiration time provided by Podbean. This ensures that the token is refreshed proactively before it truly expires.
- **Validation and refresh:** When an API request is made, the system first checks the validity of the stored token. If the token is still valid (i.e., current time is less than the stored expiration time), it is used for the API call. If the token is expired, a new token is generated from Podbean, stored with the adjusted expiration time, and then used for subsequent requests.

This approach enhances performance by reducing the frequency of token requests and ensures smooth operation by handling token expiration efficiently.

## Environment variables

## Setup instructions
### Step 1: Clone the repository
Start by cloning the repository to your local machine using Git:

```bash
git clone https://github.com/YourGitHub/on-the-way.git
cd on-the-way
```

### Step 2: Install dependencies
Navigate to the project directory and install the necessary dependencies:
```bash
npm install
# or
yarn install
```

### Step 3: Configure environment variables
Copy the .env.example file to a new file named .env, and fill in the required values:
```bash
cp .env.example .env
```

Edit the `.env` file using your favorite text editor and replace placeholders with your actual data:

- **Database configuration:** Set the POSTGRES_* variables to match your PostgreSQL database settings.
- **SMTP configuration:** Provide your SMTP credentials to enable email sending functionalities.
- **Podbean API:** Enter your Podbean API user and secret to interact with Podbean services.
- **NextAuth configuration:** Setup the `NEXTAUTH_SECRET` and `NEXTAUTH_URL` for handling authentication in your development environment.
- **Vercel settings:** If you are deploying on Vercel, set up the Vercel specific environment variables. This includes details like `VERCEL_PROJECT_ID` and `VERCEL_TEAM_ID` for deployment configurations.
- **Base URL:** Set the `BASE_URL` to your local or production URL, depending on where you are running your application.

### Step 4: Start the development server
With your environment configured, you can start the development server:
```bash
npm run dev
# or
yarn dev
```

This command starts the local server, typically accessible at `http://localhost:3000` unless configured otherwise.

### Step 5: Verify operation
Ensure that your application is running correctly by navigating to `http://localhost:3000` in your web browser. You should see the landing page of the "On The Way" platform, and you should be able to interact with the features as configured.

### Final notes
- **Data security:** Ensure that sensitive information in your `.env` file is kept secure and not shared publicly.
- **Version control:** Avoid committing your `.env` file to version control. Use `.env.example` to share necessary environment variables with placeholders.

By following these setup instructions, you should have a fully operational instance of the "On The Way" podcast platform running in your development environment. This setup provides a solid foundation for further development and customization of the platform.