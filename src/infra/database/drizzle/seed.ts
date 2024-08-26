import { BcryptEncrypter } from '@/infra/cryptography/bcrypt-encrypter.ts'
import { db, initDatabase } from './client.ts'
import { subjects, users } from './schema.ts'

async function seed() {
  await initDatabase()

  const encrypter = new BcryptEncrypter()

  const passwordHash = await encrypter.hash('123456')

  await db.insert(users).values({
    name: 'Amanda Coelho',
    username: 'amandacoelho',
    email: 'amandacoelho@alu.ufc.br',
    passwordHash,
    semester: 3,
  })

  await db.insert(users).values({
    name: 'Guilherme Bessa',
    username: 'guilhermebessa',
    email: 'guilhermebessa@alu.ufc.br',
    passwordHash,
    semester: 3,
  })

  await db.insert(subjects).values({
    name: 'Introdução a Sistemas e Mídias Digitais',
  })

  await db.insert(subjects).values({
    name: 'Comunicação Visual I',
  })

  await db.insert(subjects).values({
    name: 'Comunicação Visual II',
  })
}

seed().then(() => {
  console.log('Database seeded!')
})
