import pkg from 'mongoose'
const { Schema, model, models } = pkg

const ExperienceSchema = new Schema({
    locale: { type: String, enum: ['en', 'es'], required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, default: '' },
    location: { type: String, default: '' },
    startMonth: { type: Number, required: true },
    startYear: { type: Number, required: true },
    endMonth: { type: Number },
    endYear: { type: Number },
    bullets: [{ type: String }],
    priority: { type: Number, default: 0 },
})

export const Experience = models.Experience || model('Experience', ExperienceSchema)
