import pkg from 'mongoose'
const { Schema, model, models } = pkg

const CertificationSchema = new Schema({
    mentorship: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: Number, required: true },
    website: { type: String, default: '' },
    priority: { type: Number, default: 0 },
})

export const Certification = models.Certification || model('Certification', CertificationSchema)
