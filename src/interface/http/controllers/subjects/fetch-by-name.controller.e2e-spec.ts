// import request from 'supertest'

// import { app } from '@/app.ts'
// import { Subject } from '@/domain/deck/enterprise/entities/subject.ts'
// import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'

// describe('fetch subjects by name controller (e2e)', () => {
//   beforeAll(async () => {
//     await app.ready()
//   })

//   afterAll(async () => {
//     await app.close()
//   })

//   it('should be able to fetch subjects by name', async () => {
//     const subjectRepository = new PrismaSubjectsRepository()
//     const ihc1 = Subject.create({
//       name: 'Interação Humano-Computador I',
//     })

//     const ihc2 = Subject.create({
//       name: 'Interação Humano-Computador II',
//     })

//     await subjectRepository.create(ihc1)
//     await subjectRepository.create(ihc2)

//     const response = await request(app.server).get('/subjects?name=Interação')

//     expect(response.status).toBe(200)
//     expect(response.body).toMatchObject({
//       subjects: [
//         { id: ihc1.id, name: ihc1.name },
//         { id: ihc2.id, name: ihc2.name },
//       ],
//     })
//   })
// })
