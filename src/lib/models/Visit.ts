import pkg from 'mongoose'
const { Schema, model, models } = pkg

const VisitSchema = new Schema({
    page:      { type: String, required: true },   // '/' | '/resume'
    action:    { type: String, default: 'view' },  // 'view' | 'download'
    locale:    { type: String, default: 'en' },
    ipHash:    { type: String, default: '' },       // SHA-256 hashed (primeros 16 chars)
    userAgent: { type: String, default: '' },
    device:    { type: String, default: 'desktop' }, // 'desktop' | 'mobile' | 'tablet'
    country:   { type: String, default: '' },        // desde CF-IPCountry header o IP lookup
    timestamp: { type: Date, default: Date.now },
})

// TTL index: eliminar visitas de más de 90 días automáticamente
VisitSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 })

// Index para deduplicar refreshes: mismo ipHash + página en el mismo minuto
VisitSchema.index({ ipHash: 1, page: 1, timestamp: 1 })

export const Visit = models.Visit || model('Visit', VisitSchema)
