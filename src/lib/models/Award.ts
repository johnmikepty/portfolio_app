import pkg from 'mongoose'
const { Schema, model, models } = pkg

const AwardSchema = new Schema({
    locale: { type: String, enum: ['en', 'es'], required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    bullets: [{ type: String }],
})

export const Award = models.Award || model('Award', AwardSchema)
