// import request from 'supertest'

// import { app } from '@/app.ts'
// import { Professor } from '@/domain/deck/enterprise/entities/professor.ts'
// import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'

// describe('fetch professors by name controller (e2e)', () => {
//   beforeAll(async () => {
//     await app.ready()
//   })

//   afterAll(async () => {
//     await app.close()
//   })

//   it('should be able to fetch professors by name', async () => {
//     const professorRepository = new PrismaProfessorsRepository()
//     const prof1 = Professor.create({
//       name: 'Henrique Sergio Lima Pequeno',
//     })

//     const prof2 = Professor.create({
//       name: 'Inga Freire Saboia',
//     })

//     const prof3 = Professor.create({
//       name: 'Henrique Barbosa Silva',
//     })

//     await professorRepository.create(prof1)
//     await professorRepository.create(prof2)
//     await professorRepository.create(prof3)

//     const response = await request(app.server).get('/professors?name=Henrique')

//     expect(response.status).toBe(200)
//     expect(response.body).toMatchObject({
//       professors: [
//         { id: prof1.id, name: prof1.name },
//         { id: prof3.id, name: prof3.name },
//       ],
//     })
//   })
// })
