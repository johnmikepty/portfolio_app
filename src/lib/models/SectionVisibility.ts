import pkg from 'mongoose'
const { Schema, model, models } = pkg

// Controla qué secciones son visibles en /resume y /portfolio
const SectionVisibilitySchema = new Schema({
    page: { type: String, enum: ['resume', 'portfolio'], required: true },
    sections: {
        // Resume sections
        summary:        { type: Boolean, default: true },
        skills:         { type: Boolean, default: true },
        experience:     { type: Boolean, default: true },
        education:      { type: Boolean, default: true },
        projects:       { type: Boolean, default: true },
        certifications: { type: Boolean, default: true },
        awards:         { type: Boolean, default: true },
        references:     { type: Boolean, default: true },
        // Portfolio sections
        highlights:     { type: Boolean, default: true },
        contact:        { type: Boolean, default: true },
    }
})

export const SectionVisibility = models.SectionVisibility || model('SectionVisibility', SectionVisibilitySchema)
