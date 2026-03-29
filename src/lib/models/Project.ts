import pkg from 'mongoose'
const { Schema, model, models } = pkg

const ProjectSchema = new Schema({
    locale: { type: String, enum: ['en', 'es'], required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    icons: [{ type: String }],
    bullets: [{ type: String }],
    priority: { type: Number, default: 0 },
})

export const Project = models.Project || model('Project', ProjectSchema)
