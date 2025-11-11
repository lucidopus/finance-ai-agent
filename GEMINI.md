# Project Overview

This is a Next.js 15 project bootstrapped with `create-next-app`. It is a web application designed to be an intelligent KYC automation platform. The goal is to transform how banks process customer onboarding documents by using AI to extract data, assess risk, and guide analysts through decisions.

The project uses TypeScript, Tailwind CSS for styling, and ESLint for linting. The application is structured using the Next.js App Router.

## Building and Running

### Prerequisites

*   Node.js (v18 or higher)
*   Yarn
*   MongoDB instance

### Installation

1.  Install dependencies:
    ```bash
    yarn install
    ```

### Running the application

1.  Set up your environment variables by creating a `.env.local` file. You will need to add your LandingAI API key and MongoDB connection string.
2.  Run the development server:
    ```bash
    yarn dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for production

```bash
yarn build
```

### Starting the production server

```bash
yarn start
```

### Linting

```bash
yarn lint
```

## Development Conventions

*   **Styling**: The project uses Tailwind CSS. It is configured in `postcss.config.mjs`.
*   **TypeScript**: The project uses TypeScript. The configuration is in `tsconfig.json`. It uses a path alias `@/*` to refer to the root directory.
*   **Linting**: The project uses ESLint with the recommended Next.js configuration. The configuration is in `eslint.config.mjs`.
*   **Fonts**: The project uses `next/font` to load the Geist Sans and Geist Mono fonts.
*   **Project Structure**: The project uses the Next.js App Router. The main page is `app/page.tsx` and the root layout is `app/layout.tsx`.
