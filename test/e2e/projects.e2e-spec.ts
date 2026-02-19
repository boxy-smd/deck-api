import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { StorageUploader } from '@/@core/application/users/storage/uploader'
import { clearDatabase } from './database-utils'
import { getDrizzleInstance } from './helpers/drizzle.helper'
import { seedCommonData } from './helpers/fixtures.helper'
import { createTestApp } from './setup-e2e'

/**
 * Projects E2E Tests - Simplified
 *
 * Only tests critical happy paths.
 * Validation and business logic are covered by unit/integration tests.
 */
describe('Projects E2E', () => {
  let app: INestApplication
  let db: ReturnType<typeof getDrizzleInstance>
  let authToken: string
  let uploadSpy: ReturnType<typeof vi.spyOn>

  beforeAll(async () => {
    app = await createTestApp()
    db = getDrizzleInstance(app)
    const storageUploader = app.get(StorageUploader)
    uploadSpy = vi.spyOn(storageUploader, 'upload').mockResolvedValue({
      downloadUrl: 'https://cdn.example.com/rich-text/test.png',
    })
  })

  afterAll(async () => {
    uploadSpy.mockRestore()
    await app.close()
  })

  beforeEach(async () => {
    await clearDatabase(db)
    await seedCommonData(db)

    // Register and authenticate student
    await request(app.getHttpServer()).post('/students').send({
      name: 'Autor Teste',
      username: 'autorteste',
      email: 'autor@alu.ufc.br',
      password: 'senha123',
      semester: 3,
      trailsIds: [],
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'autor@alu.ufc.br',
        password: 'senha123',
      })

    authToken = loginResponse.body.token
  })

  it('should create a new project (happy path)', async () => {
    const response = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Meu Projeto Incrível',
        description: 'Descrição do projeto',
        content: 'Conteúdo detalhado do projeto',
        semester: 5,
        publishedYear: 2024,
      })
      .expect(201)

    expect(response.body).toHaveProperty('project_id')
    expect(response.body.project_id).toBeDefined()
  })

  it('should list all projects (happy path)', async () => {
    // Create 2 projects
    await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Projeto 1',
        description: 'Descrição 1',
        publishedYear: 2024,
        semester: 1,
      })
      .expect(201)

    await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Projeto 2',
        description: 'Descrição 2',
        publishedYear: 2024,
        semester: 2,
      })
      .expect(201)

    // List projects
    const response = await request(app.getHttpServer())
      .get('/posts')
      .expect(200)

    expect(response.body).toHaveProperty('posts')
    expect(Array.isArray(response.body.posts)).toBe(true)
  })

  it('should get project by ID (happy path)', async () => {
    // Create project
    const createResponse = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Projeto para Buscar',
        description: 'Descrição',
        content: 'Conteúdo',
        publishedYear: 2024,
        semester: 1,
      })
      .expect(201)

    const projectId = createResponse.body.project_id

    // Get project
    const response = await request(app.getHttpServer())
      .get(`/projects/${projectId}`)
      .expect(200)

    expect(response.body).toHaveProperty('id')
    expect(response.body.title).toBe('Projeto para Buscar')
    expect(response.body.description).toBe('Descrição')
  })

  it('should upload rich text image when authenticated', async () => {
    const response = await request(app.getHttpServer())
      .post('/projects/rich-text-images')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', Buffer.from('fake-image-content'), 'editor-image.png')
      .expect(201)

    expect(response.body).toEqual({
      url: 'https://cdn.example.com/rich-text/test.png',
    })
    expect(uploadSpy).toHaveBeenCalledTimes(1)
  })

  it('should return 401 when uploading rich text image without token', async () => {
    await request(app.getHttpServer())
      .post('/projects/rich-text-images')
      .attach('file', Buffer.from('fake-image-content'), 'editor-image.png')
      .expect(401)
  })
})
