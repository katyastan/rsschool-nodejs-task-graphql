import { FastifyRequest } from 'fastify';
import { buildLoaders } from './loaders.js';

export function buildContext(req: FastifyRequest, fastify) {
  const prisma = fastify.prisma;
  const loaders = buildLoaders(prisma);

  return {
    prisma,
    loaders,
    fastify,
  };
}
