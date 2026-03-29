import pkg from 'mongoose'
const { Schema, model, models } = pkg

const SkillSectionSchema = new Schema({
    title: { type: String, required: true },
    items: [{ type: String }],
    priority: { type: Number, default: 0 },
})

export const SkillSection = models.SkillSection || model('SkillSection', SkillSectionSchema)
