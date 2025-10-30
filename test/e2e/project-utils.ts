import type { INestApplication } from '@nestjs/common'
import request from 'supertest'

/**
 * Publica um projeto via API
 */
export async function createProject(
  app: INestApplication,
  token: string,
  data: {
    title: string
    description: string
    content: string
    publishedYear: number
    semester: number
    subjectId: string
    trailsIds: string[]
    professorsIds: string[]
    bannerUrl?: string
    allowComments?: boolean
    draftId?: string
  },
) {
  return await request(app.getHttpServer())
    .post('/projects')
    .set('Authorization', `Bearer ${token}`)
    .send(data)
}

/**
 * Busca um projeto por ID
 */
export async function getProject(app: INestApplication, projectId: string) {
  return await request(app.getHttpServer()).get(`/projects/${projectId}`)
}

/**
 * Lista publicações (posts)
 */
export async function listPosts(
  app: INestApplication,
  query?: {
    query?: string
    page?: number
    perPage?: number
  },
) {
  let url = '/posts'
  const params = new URLSearchParams()

  if (query?.query) params.append('query', query.query)
  if (query?.page) params.append('page', query.page.toString())
  if (query?.perPage) params.append('perPage', query.perPage.toString())

  if (params.toString()) {
    url += `?${params.toString()}`
  }

  return await request(app.getHttpServer()).get(url)
}

/**
 * Busca e filtra publicações
 */
export async function searchPosts(
  app: INestApplication,
  filters?: {
    title?: string
    professorName?: string
    tags?: string[]
    subjectId?: string
    trailsIds?: string[]
    semester?: number
    publishedYear?: number
    page?: number
    perPage?: number
  },
) {
  let url = '/posts/search'
  const params = new URLSearchParams()

  if (filters?.title) params.append('title', filters.title)
  if (filters?.professorName)
    params.append('professorName', filters.professorName)
  if (filters?.subjectId) params.append('subjectId', filters.subjectId)
  if (filters?.semester) params.append('semester', filters.semester.toString())
  if (filters?.publishedYear)
    params.append('publishedYear', filters.publishedYear.toString())
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.perPage) params.append('perPage', filters.perPage.toString())

  if (filters?.tags) {
    for (const tag of filters.tags) {
      params.append('tags', tag)
    }
  }

  if (filters?.trailsIds) {
    for (const trailId of filters.trailsIds) {
      params.append('trailsIds', trailId)
    }
  }

  if (params.toString()) {
    url += `?${params.toString()}`
  }

  return await request(app.getHttpServer()).get(url)
}

/**
 * Deleta um projeto
 */
export async function deleteProject(
  app: INestApplication,
  token: string,
  projectId: string,
) {
  return await request(app.getHttpServer())
    .delete(`/projects/${projectId}`)
    .set('Authorization', `Bearer ${token}`)
}
