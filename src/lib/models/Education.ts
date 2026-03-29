import pkg from 'mongoose'
const { Schema, model, models } = pkg

const EducationSchema = new Schema({
    locale: { type: String, enum: ['en', 'es'], required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    degree: { type: String, required: true },
    subject: { type: String, default: '' },
    year: { type: Number, required: true },
    url: { type: String, default: '' },
    bullets: [{ type: String }],
})

export const Education = models.Education || model('Education', EducationSchema)
