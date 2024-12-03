// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URL: string = process.env.MONGODB_URL as string;

if (!MONGODB_URL) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Adding to global to prevent reinitialization on hot-reload in development
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache;
}

const cache: MongooseCache = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cache;

async function dbConnect(): Promise<typeof mongoose> {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URL).then((mongooseInstance) => mongooseInstance);
  }
  cache.conn = await cache.promise;
  return cache.conn;
}

export default dbConnect;
