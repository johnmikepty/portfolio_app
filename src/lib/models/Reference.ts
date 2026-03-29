import pkg from 'mongoose'
const { Schema, model, models } = pkg

const ReferenceSchema = new Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    priority: { type: Number, default: 0 },
})

export const Reference = models.Reference || model('Reference', ReferenceSchema)
