/*
 * =============================================================================
 * Main Server Entry Point (index.js)
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// Section 1: Imports and Initial Setup
// -----------------------------------------------------------------------------

import 'dotenv/config'; // Loads environment variables immediately
import Fastify from 'fastify';
import cors from '@fastify/cors';
import mercurius from 'mercurius';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { createRequire } from 'module'; // Helper to import JSON files

// Import our custom application modules
import connectDB from './src/config/db.js';
import schema from './src/graphql/schema.js';
import resolvers from './src/graphql/resolvers.js';
import authenticate from './src/middleware/auth.js';

// Create a require function to handle JSON imports in ES modules
const require = createRequire(import.meta.url);

// Initialize Fastify with a pretty logger for development
const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// -----------------------------------------------------------------------------
// Section 2: Server Initialization Function
// -----------------------------------------------------------------------------

const initializeServer = async () => {
  try {
    // --- Step 1: Connect to the MongoDB Database ---
    await connectDB();

    // --- Step 2: Initialize Firebase Admin SDK ---
    if (!getApps().length) {
      const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (!serviceAccountPath) {
        throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable not set.');
      }
      const serviceAccount = require(serviceAccountPath);
      initializeApp({
        credential: cert(serviceAccount),
      });
      fastify.log.info('Firebase Admin SDK initialized successfully.');
    } else {
      fastify.log.warn('Firebase Admin SDK was already initialized.');
    }

    // --- Step 3: Register Fastify Plugins ---
    await fastify.register(cors, {
      origin: '*', // For development. In production, use your frontend's URL.
    });
    fastify.log.info('CORS has been enabled for all origins.');

    await fastify.register(mercurius, {
      schema,
      resolvers,
      graphiql: true,
      context: (request) => ({ user: request.user }),
    });
    fastify.log.info('GraphQL (Mercurius) has been registered.');

    // --- Step 4: Register Hooks ---
    fastify.addHook('onRequest', authenticate);

    // --- Step 5: Start the Server ---
    const port = process.env.PORT || 4000;
    await fastify.listen({ port, host: '0.0.0.0' });

  } catch (err) {
    fastify.log.error('❌ Server initialization failed!', err);
    process.exit(1);
  }
};

// -----------------------------------------------------------------------------
// Section 3: Graceful Shutdown
// -----------------------------------------------------------------------------

const gracefullyClose = async () => {
  fastify.log.info('Shutting down server...');
  await fastify.close();
  process.exit(0);
};

process.on('SIGINT', gracefullyClose);
process.on('SIGTERM', gracefullyClose);

// -----------------------------------------------------------------------------
// Section 4: Start the Application
// -----------------------------------------------------------------------------

initializeServer();