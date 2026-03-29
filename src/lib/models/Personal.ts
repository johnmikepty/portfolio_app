import pkg from 'mongoose'
const { Schema, model, models } = pkg

const PersonalSchema = new Schema({
    locale: { type: String, enum: ['en', 'es'], required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    linkedin: { type: String, required: true },
    github: { type: String, required: true },
    website: { type: String, default: '' },
    location: { type: String, required: true },
    bio: { type: String, required: true },
    bioHtml: { type: String, default: '' },
})

export const Personal = models.Personal || model('Personal', PersonalSchema)
