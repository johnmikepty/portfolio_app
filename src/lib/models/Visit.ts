import pkg from 'mongoose'
const { Schema, model, models } = pkg

const VisitSchema = new Schema({
    page: { type: String, required: true },       // '/' | '/resume'
    action: { type: String, default: 'view' },    // 'view' | 'download'
    locale: { type: String, default: 'en' },
    ipHash: { type: String, default: '' },        // SHA-256 hashed
    userAgent: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
})

export const Visit = models.Visit || model('Visit', VisitSchema)
