/**
 * fix-visibility.mjs
 * node scripts/fix-visibility.mjs
 */
import mongoose from 'mongoose'

const uri = 'mongodb://admin:admin1234@localhost:27017/portfolio?authSource=admin'

await mongoose.connect(uri)
console.log('Connected')

const db = mongoose.connection.db
const col = db.collection('sectionvisibilities')

const defaults = {
    summary: true, skills: true, experience: true, education: true,
    projects: true, certifications: true, awards: true, references: true,
    highlights: true, contact: true,
}

for (const page of ['resume', 'portfolio']) {
    await col.updateOne(
        { page },
        { $set: { sections: defaults } },
        { upsert: true }
    )
    console.log(`✓ ${page} reset`)
}

await mongoose.disconnect()
console.log('Done')
