import { readFileSync } from 'node:fs'

import axios from 'axios'
import { load } from 'cheerio'

import { PrismaClient, SubjectType } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

interface Subject {
  code: string
  name: string
  workload: number
  semester: number
  category:
    | 'Disciplina'
    | 'Atividades Complementares'
    | 'Trabalho de Conclusão de Curso'
  type: 'Obrigatória' | 'Eletiva' | 'Optativa'
  prerequisites: string[]
  equivalences: string[]
}

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
  const jsonPath = 'prisma/data/matriz-curricular.json'

  const jsonFile = readFileSync(jsonPath, 'utf-8')
  const jsonData: Subject[] = JSON.parse(jsonFile)

  return jsonData.map(subject => {
    let type: SubjectType

    switch (subject.type) {
      case 'Obrigatória':
        type = SubjectType.OBLIGATORY
        break
      case 'Eletiva':
        type = SubjectType.ELECTIVE
        break
      case 'Optativa':
        type = SubjectType.OPTIONAL
        break
      default:
        type = SubjectType.OPTIONAL
    }

    return {
      ...subject,
      type,
    }
  })
}

async function seed() {
  // Check if seed has already been executed
  const existingTrails = await prisma.trail.count()
  if (existingTrails > 0) {
    console.log('⏭️  Database already seeded, skipping...')
    return
  }

  console.log('🌱 Starting database seed...')

  const professors = await fetchProfessors()

  await Promise.all(
    professors.map(professor =>
      prisma.professor.create({
        data: {
          name: professor,
        },
      }),
    ),
  )

  const subjects = fetchSubjects()

  await Promise.all(
    subjects
      .filter(subject => !!subject.code)
      .map(subject =>
        prisma.subject.create({
          data: {
            name: subject.name,
            code: subject.code,
            semester: subject.semester,
            type: subject.type,
            workload: subject.workload,
          },
        }),
      ),
  )

  const trails = [
    {
      id: 'e310c8db-1609-404a-a190-15ab03b30991',
      name: 'Sistemas',
    },
    {
      id: '160d7df1-c66e-48b5-9421-3097d5eea46e',
      name: 'Design',
    },
    {
      id: '6984d27d-e9b7-4fe0-bacd-6fb2c79f139a',
      name: 'Audiovisual',
    },
    {
      id: 'f66f4f5b-d872-4cda-a384-3d005d1df00b',
      name: 'Jogos',
    },
  ]

  const [systemsTrail, designTrail] = await Promise.all(
    trails.map(trail =>
      prisma.trail.create({
        data: {
          id: trail.id,
          name: trail.name,
        },
      }),
    ),
  )

  // Create users directly with Prisma
  const amandaUser = await prisma.user.create({
    data: {
      name: 'Amanda Coelho',
      username: 'amandafnsc',
      email: 'amanda@alu.ufc.br',
      about: 'Estudante de Sistemas e Mídias',
      passwordHash: await hash('123456', 8),
      role: 'STUDENT',
      status: 'ACTIVE',
    },
  })

  // Create student profile for Amanda
  await prisma.studentProfile.create({
    data: {
      studentId: amandaUser.id,
      semester: 3,
    },
  })

  // Associate Amanda with Design trail
  await prisma.studentHasTrail.create({
    data: {
      studentId: amandaUser.id,
      trailId: designTrail.id,
    },
  })

  const leviUser = await prisma.user.create({
    data: {
      name: 'Levi de Brito',
      username: 'levikbrito',
      email: 'levi@alu.ufc.br',
      about: 'Estudante de Sistemas e Mídias',
      passwordHash: await hash('123456', 8),
      role: 'STUDENT',
      status: 'ACTIVE',
    },
  })

  // Create student profile for Levi
  await prisma.studentProfile.create({
    data: {
      studentId: leviUser.id,
      semester: 3,
    },
  })

  // Associate Levi with Systems trail
  await prisma.studentHasTrail.create({
    data: {
      studentId: leviUser.id,
      trailId: systemsTrail.id,
    },
  })

  console.log('✅ Users created successfully!')
  console.log('✅ Database seeded!')
}

seed().then(() => {
  prisma.$disconnect()
})
