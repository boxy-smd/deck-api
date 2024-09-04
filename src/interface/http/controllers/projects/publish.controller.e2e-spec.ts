import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app.ts'
import { Professor } from '@/domain/deck/enterprise/entities/professor.ts'
import { Subject } from '@/domain/deck/enterprise/entities/subject.ts'
import { Trail } from '@/domain/deck/enterprise/entities/trail.ts'
import { BcryptEncrypter } from '@/infra/cryptography/bcrypt-encrypter.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/users-repository.ts'

describe('publish project (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to publish a project', async () => {
    const trailsRepository = new PrismaTrailsRepository()
    const professorsRepository = new PrismaProfessorsRepository()
    const subjectsRepository = new PrismaSubjectsRepository()
    const usersRepository = new PrismaUsersRepository()

    const trail = Trail.create({
      name: 'Design',
    })

    const professor = Professor.create({
      name: 'Ticianne de Gois Ribeiro Darin',
    })

    const subject = Subject.create({
      name: 'Interação Humano-Computador I',
    })

    const authorOrError = User.create({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@alu.ufc.br',
      passwordHash: await User.hashPassword('123456', new BcryptEncrypter()),
      semester: 3,
    })

    if (authorOrError.isLeft()) {
      throw authorOrError.value
    }

    const author = authorOrError.value

    await trailsRepository.create(trail)
    await professorsRepository.create(professor)
    await subjectsRepository.create(subject)
    await usersRepository.create(author)

    const response = await request(app.server)
      .post('/projects')
      .send({
        title: 'Design de Interação',
        description: 'Projeto de Design de Interação',
        bannerUrl: 'https://example.com/banner.jpg',
        content: 'Conteúdo do projeto',
        publishedYear: 2021,
        status: 'PUBLISHED',
        semester: 3,
        allowComments: true,
        authorId: author.id,
        subjectId: subject.id,
        trailsIds: [trail.id],
        professorsIds: [professor.id],
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      message: 'Project published successfully.',
    })
  })
})
