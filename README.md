# DocsBuddy
DocsBuddy is a powerful tool designed to assist users in managing, searching, and processing documentation and knowledge resources through an intelligent and user-friendly interface. Leveraging a robust architecture, DocsBuddy enables efficient document storage, advanced search capabilities, and AI-powered processing to deliver insights quickly and accurately.

## Why DocsBuddy is Needed
DocsBuddy addresses several key challenges faced by individuals and organizations in managing, retrieving, and gaining insights from large volumes of documentation and knowledge resources. Here’s why DocsBuddy is needed and the specific problems it solves. e.g. In many fields, documentation, knowledge resources, and records grow rapidly, making it hard for users to find the exact information they need. DocsBuddy’s AI-powered vector search enables semantic searches, understanding the meaning behind a query rather than just matching keywords. This allows users to find relevant information more efficiently, even if they don’t use exact terms, improving search accuracy and relevancy.

# Getting Started
Follow these steps to set up and run DocsBuddy on your local machine.

1. Clone the Repository
Clone the realtime-analyser repository from GitHub to your local machine.

```bash
git clone https://github.com/Cloud-Hacks/realtime-analyser.git
cd realtime-analyser
```

2. Create a .env File
Create a .env file in the root directory of the project and add the following environment variables:

```plaintext
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

#Embedding
VULTR_API_KEY=

# Vultr Managed Database
PGHOST=
PGDATABASE=
PGUSER=
PGPASSWORD=

# Vultr S3
NEXT_PUBLIC_S3_ACCESS_KEY_ID=
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY=
NEXT_PUBLIC_S3_BUCKET_NAME=

# Pinecone
PINECONE_API_KEY=

NEXT_BASE_URL=http://localhost:3000
```
Make sure to replace the placeholders with your actual credentials and keys.

3. Install Dependencies
Install the necessary dependencies using npm.


```bash
npm install
```

4. Run the Development Server
Start the development server.

```bash
npm run dev
```

Your application should now be running on http://localhost:3000.

### Technologies Used
* Next.js: React framework for building the frontend.
* React.js: Library for building user interfaces.
* Tailwind CSS: Utility-first CSS framework for styling.
* Clerk: Authentication service for handling user authentication.
* Pinecone: Vector database for efficient document search and retrieval.
* Vultr Managed PostgreSQL: Relational database for storing user data.
* Vultr S3: Storage service for storing user-uploaded files.
* Vultr Serverless Inference: AI models for generating document embeddings and processing user queries.


### Contributions
Contributions are welcome! If you have any ideas or suggestions to improve DocsBuddy, feel free to create an issue or submit a pull request.
