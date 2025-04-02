import { readFileSync } from 'node:fs'

import axios from 'axios'
import { load } from 'cheerio'

import { Email } from '@/domain/deck/enterprise/entities/value-objects/email.ts'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher.ts'
import { prisma } from '@/infra/database/prisma/client.ts'
import { makeStudent } from 'test/factories/make-student.ts'

interface Subject {
  code: string
  name: string
  workload: string
  periods: string
  full_workload: string
  category:
    | 'Disciplina'
    | 'Atividades Complementares'
    | 'Trabalho de Conclusão de Curso'
  type: 'Obrigatória' | 'Optativa'
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
  // const instance = axios.create()

  // const subjectsUrl =
  //   'https://smd.ufc.br/pt/sobre-o-curso/matrizcurriculardiurno/'

  // const subjectsScrap = await instance.get(subjectsUrl)
  // const $ = load(subjectsScrap.data)

  const jsonPath = 'prisma/data/matriz-curricular.json'

  const jsonFile = readFileSync(jsonPath, 'utf-8')
  const jsonData: Subject[] = JSON.parse(jsonFile)

  // function capitalizeName(name: string) {
  //   return name
  //     .split(' ')
  //     .map(word => {
  //       return word.charAt(0).toUpperCase() + word.slice(1)
  //     })
  //     .join(' ')
  // }

  // const subjects = jsonData
  //   .map(subject => {
  //     return subject["Componente Curricular"]
  //   })
  //   .filter(subject => subject !== 'COMPONENTE')
  //   .filter(subject => !subject.startsWith('ELETIVA'))
  //   .map(subject => {
  //     return capitalizeName(subject.toLowerCase())
  //   })
  //   .map(subject => {
  //     if (subject.includes('Iii')) {
  //       return subject.replaceAll('Iii', 'III')
  //     }

  //     return subject
  //   })
  //   .map(subject => {
  //     if (subject.includes('Ii')) {
  //       return subject.replaceAll('Ii', 'II')
  //     }

  //     return subject
  //   })
  //   .map(subject => {
  //     if (subject.includes(' E ')) {
  //       return subject.replaceAll(' E ', ' e ')
  //     }

  //     return subject
  //   })
  //   .map(subject => {
  //     if (subject.includes(' À ')) {
  //       return subject.replaceAll(' À ', ' à ')
  //     }

  //     return subject
  //   })
  //   .map(subject => {
  //     if (subject.includes(' A ')) {
  //       return subject.replaceAll(' A ', ' a ')
  //     }

  //     return subject
  //   })
  //   .map(subject => {
  //     if (subject.includes(' De ')) {
  //       return subject.replaceAll(' De ', ' de ')
  //     }

  //     return subject
  //   })
  //   .map(subject => {
  //     if (subject.includes(' Da ')) {
  //       return subject.replaceAll(' Da ', ' da ')
  //     }

  //     return subject
  //   })
  //   .map(subject => {
  //     if (subject.includes(' Do ')) {
  //       return subject.replaceAll(' Do ', ' do ')
  //     }

  //     return subject
  //   })
  //   .map(subject => {
  //     if (subject.includes(' Em ')) {
  //       return subject.replaceAll(' Em ', ' em ')
  //     }

  //     return subject
  //   })
  //   .map(subject => {
  //     if (subject.includes(' No ')) {
  //       return subject.replaceAll(' No ', ' no ')
  //     }

  //     return subject
  //   })
  //   .map(subject => {
  //     if (subject.includes(' Nos ')) {
  //       return subject.replaceAll(' Nos ', ' nos ')
  //     }

  //     return subject
  //   })
  //   .map(subject => {
  //     if (subject.includes(' Na ')) {
  //       return subject.replaceAll(' Na ', ' na ')
  //     }

  //     return subject
  //   })
  //   .map(subject => {
  //     if (subject.includes(' Nas ')) {
  //       return subject.replaceAll(' Nas ', ' nas ')
  //     }

  //     return subject
  //   })
  //   .map(subject => {
  //     if (subject.includes(' Para ')) {
  //       return subject.replaceAll(' Para ', ' para ')
  //     }

  //     return subject
  //   })
  //   .map(subject => {
  //     if (subject.includes('Coginicao')) {
  //       return subject.replaceAll('Coginicao', 'Cognição')
  //     }

  //     return subject
  //   })

  return jsonData
}

async function seed() {
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

  const subjects = await fetchSubjects()

  await Promise.all(
    subjects.map(subject =>
      prisma.subject.create({
        data: {
          name: subject.name,
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

  const amanda = await makeStudent({
    name: 'Amanda Coelho',
    username: 'amandafnsc',
    email: Email.create('amanda@alu.ufc.br'),
    about: 'Estudante de Sistemas e Mídias',
  })

  const levi = await makeStudent({
    name: 'Levi de Brito',
    username: 'levikbrito',
    email: Email.create('levi@alu.ufc.br'),
    about: 'Estudante de Sistemas e Mídias',
  })

  await prisma.user.create({
    data: {
      name: amanda.name,
      username: amanda.username,
      email: amanda.email.value,
      about: amanda.about,
      passwordHash: await new BcryptHasher().hash('123456'),
      semester: 3,
      trails: {
        connect: {
          id: designTrail.id,
        },
      },
    },
  })

  await prisma.user.create({
    data: {
      name: levi.name,
      username: levi.username,
      email: levi.email.value,
      about: levi.about,
      passwordHash: await new BcryptHasher().hash('123456'),
      semester: 3,
      trails: {
        connect: {
          id: systemsTrail.id,
        },
      },
    },
  })
}

seed().then(() => {
  console.log('Database seeded!')
  prisma.$disconnect()
})
