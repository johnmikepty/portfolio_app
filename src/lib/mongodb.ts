import pkg from 'mongoose'
const { mongoose: _mongoose, connect, connection, Schema, model, models } = pkg

const MONGODB_URI = import.meta.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables')
}

let cached = (global as any).__mongoose

if (!cached) {
    cached = (global as any).__mongoose = { conn: null, promise: null }
}

export async function connectDB() {
    if (cached.conn) return cached.conn

    if (!cached.promise) {
        cached.promise = pkg.connect(MONGODB_URI, {
            dbName: 'portfolio',
            bufferCommands: false,
        })
    }

    cached.conn = await cached.promise
    return cached.conn
}

export { Schema, model, models }
