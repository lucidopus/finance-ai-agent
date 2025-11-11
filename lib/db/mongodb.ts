import mongoose from 'mongoose'

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined in environment variables')
}

const MONGODB_URI: string = process.env.MONGODB_URI

interface CachedConnection {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Global type augmentation for Next.js hot reloading
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: CachedConnection | undefined
}

let cached: CachedConnection = global.mongooseCache || {
  conn: null,
  promise: null
}

if (!global.mongooseCache) {
  global.mongooseCache = cached
}

/**
 * Establishes connection to MongoDB with connection pooling
 * Optimized for serverless environments (Next.js API routes)
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return cached connection if available
  if (cached.conn) {
    return cached.conn
  }

  // Return existing connection promise if in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully')
      return mongoose
    }).catch((error) => {
      console.error('MongoDB connection error:', error)
      cached.promise = null
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

/**
 * Disconnects from MongoDB (useful for testing)
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (cached.conn) {
    await cached.conn.disconnect()
    cached.conn = null
    cached.promise = null
    console.log('MongoDB disconnected')
  }
}
