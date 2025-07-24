import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import mercurius from 'mercurius';

import connectDB from './src/config/db.js';
import schema from './src/graphql/schema.js';
import resolvers from './src/graphql/resolvers.js';

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: { translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' },
    },
  },
});

const initializeServer = async () => {
  try {
    await connectDB();

    await fastify.register(cors, { origin: '*' });
    fastify.log.info('CORS has been enabled for all origins.');

    await fastify.register(mercurius, {
      schema,
      resolvers,
      graphiql: true,
      // Context is no longer needed as there's no user authentication
    });
    fastify.log.info('GraphQL (Mercurius) has been registered.');

    const port = process.env.PORT || 4000;
    await fastify.listen({ port, host: '0.0.0.0' });

  } catch (err) {
    fastify.log.error('❌ Server initialization failed!', err);
    process.exit(1);
  }
};

const gracefullyClose = async () => {
  fastify.log.info('Shutting down server...');
  await fastify.close();
  process.exit(0);
};

process.on('SIGINT', gracefullyClose);
process.on('SIGTERM', gracefullyClose);

initializeServer();
