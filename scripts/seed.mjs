/**
 * scripts/seed.mjs
 * Populates MongoDB with dummy data (John Doe) for development and demo purposes.
 *
 * Usage:
 *   npm run db:up   # start MongoDB in Docker
 *   npm run seed    # run this script
 *
 * Safe to commit — contains no real personal data.
 */

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
    console.error(`
❌ MONGODB_URI is not set.

Create a .env file before running the seed:

  echo "MONGODB_URI=mongodb://admin:admin1234@localhost:27017/portfolio_test?authSource=admin" > .env
  echo "JWT_SECRET=test-secret" >> .env

Then run:

  npm run db:up
  npm run seed
  npm run dev
`)
    process.exit(1)
}

// ─── Inline models (avoids TS imports) ───────────────────────────────────────

const { Schema, model, models } = mongoose

const Personal      = models.Personal      || model('Personal',      new Schema({ locale: String, name: String, title: String, email: String, phone: String, linkedin: String, github: String, website: String, location: String, bio: String, bioHtml: String }))
const Experience    = models.Experience    || model('Experience',    new Schema({ locale: String, slug: String, name: String, title: String, url: String, location: String, startMonth: Number, startYear: Number, endMonth: Number, endYear: Number, bullets: [String], priority: Number }))
const Education     = models.Education     || model('Education',     new Schema({ locale: String, slug: String, name: String, degree: String, subject: String, year: Number, url: String, bullets: [String] }))
const Project       = models.Project       || model('Project',       new Schema({ locale: String, slug: String, name: String, icons: [String], bullets: [String], priority: Number }))
const Certification = models.Certification || model('Certification', new Schema({ mentorship: String, title: String, year: Number, website: String, priority: Number }))
const Award         = models.Award         || model('Award',         new Schema({ locale: String, slug: String, name: String, bullets: [String] }))
const Reference     = models.Reference     || model('Reference',     new Schema({ name: String, title: String, company: String, email: String, phone: String, priority: Number }))
const SkillSection  = models.SkillSection  || model('SkillSection',  new Schema({ title: String, items: [String], priority: Number }))

// ─── Dummy data ───────────────────────────────────────────────────────────────

const personal = [
    {
        locale: 'en',
        name: 'John Doe',
        title: 'Senior Full Stack Engineer',
        email: 'john.doe@email.com',
        phone: '+1 555 000-0000',
        linkedin: 'johndoe',
        github: 'johndoe',
        website: '',
        location: 'Panama City, Panama',
        bio: 'Over 10 years of experience architecting and delivering robust, scalable solutions across fintech, e-commerce, and infrastructure domains. Expert in modern frameworks, cloud platforms, and DevOps practices. Proven leader in team management, technical mentorship, and cross-functional collaboration.',
        bioHtml: '',
    },
    {
        locale: 'es',
        name: 'John Doe',
        title: 'Ingeniero Full Stack Senior',
        email: 'john.doe@email.com',
        phone: '+1 555 000-0000',
        linkedin: 'johndoe',
        github: 'johndoe',
        website: '',
        location: 'Ciudad de Panamá, Panamá',
        bio: 'Más de 10 años de experiencia diseñando y entregando soluciones robustas y escalables en los sectores fintech, e-commerce e infraestructura. Experto en frameworks modernos, plataformas en la nube y prácticas DevOps. Líder comprobado en gestión de equipos, mentoría técnica y colaboración multifuncional.',
        bioHtml: '',
    },
]

const experience = [
    {
        locale: 'en', slug: 'acme-corp', name: 'Acme Corp', title: 'Senior Full Stack Engineer',
        url: 'https://acmecorp.com', location: 'Remote',
        startMonth: 3, startYear: 2021, endMonth: 0, endYear: 0,
        bullets: [
            'Led development of a **microservices platform** handling 2M+ daily transactions.',
            'Reduced API response times by **40%** through query optimization and caching strategies.',
            'Mentored a team of 5 junior developers, conducting weekly code reviews.',
        ],
        priority: 3,
    },
    {
        locale: 'en', slug: 'techwave', name: 'TechWave Solutions', title: 'Full Stack Engineer',
        url: 'https://techwave.io', location: 'Panama City, Panama',
        startMonth: 6, startYear: 2018, endMonth: 2, endYear: 2021,
        bullets: [
            'Built and maintained **e-commerce platform** serving 50K+ monthly active users.',
            'Implemented CI/CD pipelines with GitHub Actions, cutting deployment time by **60%**.',
            'Designed RESTful APIs consumed by web and mobile clients.',
        ],
        priority: 2,
    },
    {
        locale: 'en', slug: 'startupxyz', name: 'StartupXYZ', title: 'Junior Developer',
        url: '', location: 'Panama City, Panama',
        startMonth: 1, startYear: 2015, endMonth: 5, endYear: 2018,
        bullets: [
            'Developed internal tools with React and Node.js for operations team.',
            'Integrated third-party payment gateways (Stripe, PayPal).',
        ],
        priority: 1,
    },
    {
        locale: 'es', slug: 'acme-corp', name: 'Acme Corp', title: 'Ingeniero Full Stack Senior',
        url: 'https://acmecorp.com', location: 'Remoto',
        startMonth: 3, startYear: 2021, endMonth: 0, endYear: 0,
        bullets: [
            'Lideré el desarrollo de una **plataforma de microservicios** que procesa más de 2M transacciones diarias.',
            'Reduje los tiempos de respuesta de la API en un **40%** mediante optimización de consultas y caché.',
            'Mentoré a un equipo de 5 desarrolladores junior con revisiones de código semanales.',
        ],
        priority: 3,
    },
    {
        locale: 'es', slug: 'techwave', name: 'TechWave Solutions', title: 'Ingeniero Full Stack',
        url: 'https://techwave.io', location: 'Ciudad de Panamá, Panamá',
        startMonth: 6, startYear: 2018, endMonth: 2, endYear: 2021,
        bullets: [
            'Construí y mantuve una **plataforma e-commerce** con más de 50K usuarios activos mensuales.',
            'Implementé pipelines CI/CD con GitHub Actions, reduciendo el tiempo de despliegue en **60%**.',
            'Diseñé APIs RESTful consumidas por clientes web y móvil.',
        ],
        priority: 2,
    },
    {
        locale: 'es', slug: 'startupxyz', name: 'StartupXYZ', title: 'Desarrollador Junior',
        url: '', location: 'Ciudad de Panamá, Panamá',
        startMonth: 1, startYear: 2015, endMonth: 5, endYear: 2018,
        bullets: [
            'Desarrollé herramientas internas con React y Node.js para el equipo de operaciones.',
            'Integré pasarelas de pago de terceros (Stripe, PayPal).',
        ],
        priority: 1,
    },
]

const education = [
    {
        locale: 'en', slug: 'university-panama', name: 'Universidad Tecnológica de Panamá',
        degree: "Bachelor's Degree", subject: 'Computer Science',
        year: 2014, url: 'https://utp.ac.pa', bullets: [],
    },
    {
        locale: 'es', slug: 'university-panama', name: 'Universidad Tecnológica de Panamá',
        degree: 'Licenciatura', subject: 'Ingeniería en Informática',
        year: 2014, url: 'https://utp.ac.pa', bullets: [],
    },
]

const projects = [
    {
        locale: 'en', slug: 'fintech-dashboard', name: 'Fintech Analytics Dashboard',
        icons: ['logos:react', 'logos:nodejs', 'logos:mongodb'],
        bullets: [
            '**Real-time dashboard** for financial transaction monitoring with WebSocket updates.',
            'Processes and visualizes 1M+ records with sub-second query response times.',
        ],
        priority: 3,
    },
    {
        locale: 'en', slug: 'ecommerce-platform', name: 'E-Commerce Platform',
        icons: ['logos:nextjs', 'logos:typescript', 'logos:postgresql'],
        bullets: [
            'Full-featured e-commerce platform with **multi-vendor support** and inventory management.',
            'Integrated Stripe payments, order tracking, and automated email notifications.',
        ],
        priority: 2,
    },
    {
        locale: 'en', slug: 'devops-toolkit', name: 'DevOps Automation Toolkit',
        icons: ['logos:python', 'logos:docker', 'logos:github'],
        bullets: [
            'CLI toolkit for **automating deployment pipelines** across multiple cloud providers.',
            'Reduced manual deployment steps from 20+ to 3 with rollback support.',
        ],
        priority: 1,
    },
    {
        locale: 'es', slug: 'fintech-dashboard', name: 'Dashboard de Análisis Fintech',
        icons: ['logos:react', 'logos:nodejs', 'logos:mongodb'],
        bullets: [
            '**Dashboard en tiempo real** para monitoreo de transacciones financieras con WebSockets.',
            'Procesa y visualiza más de 1M registros con tiempos de respuesta inferiores a 1 segundo.',
        ],
        priority: 3,
    },
    {
        locale: 'es', slug: 'ecommerce-platform', name: 'Plataforma E-Commerce',
        icons: ['logos:nextjs', 'logos:typescript', 'logos:postgresql'],
        bullets: [
            'Plataforma e-commerce completa con **soporte multi-vendedor** y gestión de inventario.',
            'Integración de pagos con Stripe, rastreo de órdenes y notificaciones por email.',
        ],
        priority: 2,
    },
    {
        locale: 'es', slug: 'devops-toolkit', name: 'Toolkit de Automatización DevOps',
        icons: ['logos:python', 'logos:docker', 'logos:github'],
        bullets: [
            'Herramienta CLI para **automatizar pipelines de despliegue** en múltiples proveedores cloud.',
            'Redujo los pasos de despliegue manual de 20+ a 3 con soporte de rollback.',
        ],
        priority: 1,
    },
]

const certifications = [
    { mentorship: 'AWS', title: 'AWS Certified Solutions Architect – Associate', year: 2022, website: 'https://aws.amazon.com/certification/', priority: 3 },
    { mentorship: 'MongoDB', title: 'MongoDB Certified Developer Associate', year: 2021, website: 'https://university.mongodb.com/', priority: 2 },
    { mentorship: 'Google', title: 'Google Cloud Professional Data Engineer', year: 2023, website: 'https://cloud.google.com/certification/', priority: 1 },
]

const awards = [
    {
        locale: 'en', slug: 'excellence-award', name: 'Excellence Award — Acme Corp',
        bullets: [
            'Awarded for outstanding performance leading the payments platform migration.',
            'Recognized for mentorship contributions to the engineering team.',
        ],
    },
    {
        locale: 'es', slug: 'excellence-award', name: 'Premio a la Excelencia — Acme Corp',
        bullets: [
            'Otorgado por rendimiento sobresaliente liderando la migración de la plataforma de pagos.',
            'Reconocido por contribuciones de mentoría al equipo de ingeniería.',
        ],
    },
]

const references = [
    { name: 'Jane Smith', title: 'Engineering Manager', company: 'Acme Corp', email: 'jane.smith@acmecorp.com', phone: '+1 555 111-2222', priority: 1 },
    { name: 'Carlos Rivera', title: 'CTO', company: 'TechWave Solutions', email: 'carlos@techwave.io', phone: '+507 6000-0000', priority: 2 },
]

const skillSections = [
    { title: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'C#', 'SQL'], priority: 0 },
    { title: 'Frontend', items: ['React', 'Next.js', 'Astro', 'HTML5', 'CSS3', 'Tailwind CSS'], priority: 1 },
    { title: 'Backend', items: ['Node.js', '.NET Core', 'Express', 'REST APIs', 'GraphQL'], priority: 2 },
    { title: 'Databases', items: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis'], priority: 3 },
    { title: 'DevOps & Cloud', items: ['Docker', 'GitHub Actions', 'AWS', 'Nginx', 'PM2', 'Linux'], priority: 4 },
    { title: 'Testing & QA', items: ['Jest', 'Playwright', 'Selenium', 'Appium', 'Cucumber'], priority: 5 },
]

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, { dbName: 'portfolio' })
    console.log('✅ Connected\n')

    console.log('🗑️  Clearing collections...')
    await Promise.all([
        Personal.deleteMany({}),
        Experience.deleteMany({}),
        Education.deleteMany({}),
        Project.deleteMany({}),
        Certification.deleteMany({}),
        Award.deleteMany({}),
        Reference.deleteMany({}),
        SkillSection.deleteMany({}),
    ])

    console.log('🌱 Seeding...')
    await Personal.insertMany(personal)
    console.log(`   ✓ Personal (${personal.length})`)
    await Experience.insertMany(experience)
    console.log(`   ✓ Experience (${experience.length})`)
    await Education.insertMany(education)
    console.log(`   ✓ Education (${education.length})`)
    await Project.insertMany(projects)
    console.log(`   ✓ Projects (${projects.length})`)
    await Certification.insertMany(certifications)
    console.log(`   ✓ Certifications (${certifications.length})`)
    await Award.insertMany(awards)
    console.log(`   ✓ Awards (${awards.length})`)
    await Reference.insertMany(references)
    console.log(`   ✓ References (${references.length})`)
    await SkillSection.insertMany(skillSections)
    console.log(`   ✓ Skill Sections (${skillSections.length})`)

    console.log('\n✅ Seed completed. Run `npm run dev` to start the app.')
    await mongoose.disconnect()
}

seed().catch(err => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
})
