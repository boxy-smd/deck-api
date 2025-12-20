import axios from 'axios'
import { hash } from 'bcrypt'
import { load } from 'cheerio'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>

import subjectsData from './data/matriz-curricular.json'
import { clearDatabase } from './utils/database-cleaner'

async function fetchProfessors() {
  const instance = axios.create()

  const professorsUrl =
    'https://smd.ufc.br/pt/corpo-docente/corpo-docente-atual/'

  const professorsScrap = await instance.get(professorsUrl)
  const $ = load(professorsScrap.data)

  const professors = $('main article p > strong')
    .map((_, element) => {
      return $(element)
        .text()
        .replace('Dr.', ' ')
        .replace('Dra.', ' ')
        .replace('Me.', ' ')
        .replace('Bel.', ' ')
        .replace('(substituto)', ' ')
        .replace('   ', ' ')
        .trim()
    })
    .get()
    .filter(professor => professor !== 'Prof.' && professor !== 'Profa.')
    .map(professor => {
      if (professor.includes('Mara')) {
        return professor.replace('Mara', 'Profa. Mara')
      }

      return professor
    })

  return professors
}

function fetchSubjects() {
  return subjectsData.map(subject => ({
    code: subject.code,
    name: subject.name,
    workload: subject.workload,
    semester: subject.semester,
    type:
      subject.type === 'Obrigatória'
        ? ('OBLIGATORY' as const)
        : ('ELECTIVE' as const),
  }))
}

async function seed() {
  console.log('🌱 Starting database seed...')

  const shouldClear = process.argv.includes('--clear')

  if (shouldClear) {
    console.log('🧹 Clearing database before seeding...')
    await clearDatabase(db)
  } else {
    // Check if already seeded
    const existingTrails = await db.select().from(schema.trails)
    if (existingTrails.length > 0) {
      console.log('⏭️  Database already seeded, skipping...')
      return
    }
  }

  // Seed professors
  const professors = await fetchProfessors()
  const professorsData = professors.map(name => ({
    id: crypto.randomUUID(),
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
  await db.insert(schema.professors).values(professorsData)
  console.log(`✅ Created ${professors.length} professors`)

  // Seed subjects
  const subjects = fetchSubjects()
  const subjectsData = subjects
    .filter(subject => !!subject.code)
    .map(subject => ({
      id: crypto.randomUUID(),
      name: subject.name,
      code: subject.code,
      semester: subject.semester,
      type: subject.type,
      workload: subject.workload,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  await db.insert(schema.subjects).values(subjectsData)
  console.log(`✅ Created ${subjectsData.length} subjects`)

  // Seed trails
  const now = new Date()
  const trails = [
    {
      id: 'e310c8db-1609-404a-a190-15ab03b30991',
      name: 'Sistemas',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '160d7df1-c66e-48b5-9421-3097d5eea46e',
      name: 'Design',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '6984d27d-e9b7-4fe0-bacd-6fb2c79f139a',
      name: 'Audiovisual',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'f66f4f5b-d872-4cda-a384-3d005d1df00b',
      name: 'Jogos',
      createdAt: now,
      updatedAt: now,
    },
  ]

  await db.insert(schema.trails).values(trails)
  console.log(`✅ Created ${trails.length} trails`)

  const [systemsTrail, designTrail] = trails

  // Create users
  const amandaUser = await db
    .insert(schema.users)
    .values({
      id: crypto.randomUUID(),
      name: 'Amanda Coelho',
      username: 'amandafnsc',
      email: 'amanda@alu.ufc.br',
      about: 'Estudante de Sistemas e Mídias',
      passwordHash: await hash('123456', 8),
      role: 'STUDENT',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  await db.insert(schema.studentProfiles).values({
    studentId: amandaUser[0].id,
    semester: 3,
  })

  await db.insert(schema.studentHasTrail).values({
    studentId: amandaUser[0].id,
    trailId: designTrail.id,
  })

  const leviUser = await db
    .insert(schema.users)
    .values({
      id: crypto.randomUUID(),
      name: 'Levi de Brito',
      username: 'levikbrito',
      email: 'levi@alu.ufc.br',
      about: 'Estudante de Sistemas e Mídias',
      passwordHash: await hash('123456', 8),
      role: 'STUDENT',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  await db.insert(schema.studentProfiles).values({
    studentId: leviUser[0].id,
    semester: 3,
  })

  await db.insert(schema.studentHasTrail).values({
    studentId: leviUser[0].id,
    trailId: systemsTrail.id,
  })

  console.log('✅ Users created successfully!')
  console.log('✅ Database seeded!')
}

seed()
  .then(() => {
    console.log('✨ Seed completed')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
