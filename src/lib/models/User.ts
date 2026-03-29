import pkg from 'mongoose'
const { Schema, model, models } = pkg

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

export const User = models.User || model('User', UserSchema)
