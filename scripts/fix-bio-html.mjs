/**
 * fix-bio-html.mjs
 * Removes any <h1>/<h2>/<h3> tags from the bioHtml field in Personal docs.
 * Run: node scripts/fix-bio-html.mjs
 */
import mongoose from 'mongoose'

const uri = 'mongodb://admin:admin1234@localhost:27017/portfolio?authSource=admin'
await mongoose.connect(uri)
console.log('Connected')

const db = mongoose.connection.db
const col = db.collection('personals')

const docs = await col.find({}).toArray()
for (const doc of docs) {
    if (!doc.bioHtml) continue
    const cleaned = doc.bioHtml
        .replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gis, '') // remove heading tags
        .trim()
    if (cleaned !== doc.bioHtml) {
        await col.updateOne({ _id: doc._id }, { $set: { bioHtml: cleaned } })
        console.log(`✓ Fixed bioHtml for locale: ${doc.locale}`)
    } else {
        console.log(`— No headings found in locale: ${doc.locale}`)
    }
}

await mongoose.disconnect()
console.log('Done')
