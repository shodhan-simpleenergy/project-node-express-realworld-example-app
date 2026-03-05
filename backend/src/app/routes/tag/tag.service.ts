import prisma from '../../../prisma/prisma-client';
import redis from '../../../redis';

const TAGS_CACHE_KEY = 'tags:all';
const TAGS_TTL = 300;

const getTags = async (id?: number): Promise<string[]> => {
  const cached = await redis.get(TAGS_CACHE_KEY);
  if (cached) {
    console.log('Tags served from Redis cache');
    return JSON.parse(cached);
  }

  const queries = [];
  queries.push({ demo: true });

  if (id) {
    queries.push({ id: { equals: id } });
  }

  const tags = await prisma.tag.findMany({
    where: {
      articles: {
        some: {
          author: {
            OR: queries,
          },
        },
      },
    },
    select: { name: true },
    orderBy: { articles: { _count: 'desc' } },
    take: 10,
  });

  const tagList = tags.map(t => t.name);
  await redis.setex(TAGS_CACHE_KEY, TAGS_TTL, JSON.stringify(tagList));
  console.log('Tags fetched from DB and cached in Redis');

  return tagList;
};

export default getTags;
