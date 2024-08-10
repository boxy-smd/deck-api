import { BcryptEncrypter } from '@/infra/cryptography/bcrypt-encrypter.ts'
import { prisma } from '@/infra/database/prisma/client.ts'

async function seed() {
  const encrypter = new BcryptEncrypter()

  const passwordHash = await encrypter.hash('123456')

  await prisma.user.create({
    data: {
      id: 'ca8c8163-8115-447b-ac7d-71f5de638039',
      name: 'Jane Doe',
      username: 'janedoe',
      email: 'janedoe@alu.ufc.br',
      passwordHash,
      semester: 1,
    },
  })
}

seed().then(() => {
  console.log('Database seeded!')
  prisma.$disconnect()
})
