import { type Either, right } from '@/@shared/kernel/either'
import type { Post } from '../../enterprise/value-objects/post'
import type { ProjectsRepository } from '../repositories/projects-repository'

interface SearchProjectsUseCaseRequest {
  // Busca textual
  query?: string
  title?: string
  
  // Filtros por tags/categorias
  tags?: string[]
  professorName?: string
  
  // Filtros por metadados
  trailsIds?: string[]
  subjectId?: string
  publishedYear?: number
  semester?: number
  
  // Paginação
  page?: number
  perPage?: number
}

type SearchProjectsUseCaseResponse = Either<
  never,
  {
    projects: Post[]
    total: number
  }
>

export class SearchProjectsUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute(
    request: SearchProjectsUseCaseRequest,
  ): Promise<SearchProjectsUseCaseResponse> {
    const {
      query,
      title,
      tags,
      professorName,
      trailsIds,
      subjectId,
      publishedYear,
      semester,
      page = 1,
      perPage = 20,
    } = request

    let projects: Post[] = []

    // Prioridade de busca:
    // 1. Busca por título específico
    if (title) {
      projects = await this.projectsRepository.findManyPostsByTitle(title)
    }
    // 2. Busca por nome de professor
    else if (professorName) {
      projects =
        await this.projectsRepository.findManyPostsByProfessorName(
          professorName,
        )
    }
    // 3. Busca por tags
    else if (tags && tags.length > 0) {
      // Buscar por cada tag e combinar resultados
      const allProjects = await Promise.all(
        tags.map(tag => this.projectsRepository.findManyPostsByTag(tag)),
      )
      // Remover duplicatas usando um Map
      const projectsMap = new Map<string, Post>()
      for (const projectList of allProjects) {
        for (const project of projectList) {
          projectsMap.set(project.id.toString(), project)
        }
      }
      projects = Array.from(projectsMap.values())
    }
    // 4. Filtro por query com metadados
    else if (trailsIds || semester || subjectId || publishedYear) {
      projects = await this.projectsRepository.findManyPostsByQuery({
        trailsIds,
        semester,
        subjectId,
        publishedYear,
      })
    }
    // 5. Busca textual genérica
    else if (query) {
      projects = await this.projectsRepository.findManyPostsByTitle(query)
    }
    // 6. Sem filtros - buscar todos os posts
    else {
      projects = await this.projectsRepository.findAllPosts()
    }

    // Aplicar filtros adicionais em memória se necessário
    let filtered = projects

    // Filtrar por trilhas se especificado e não foi usado na query principal
    if (trailsIds && !title && !professorName && !tags) {
      filtered = filtered.filter(project =>
        project.trails?.some(trailId =>
          trailsIds.includes(trailId.toString()),
        ),
      )
    }

    // Filtrar por disciplina se especificado e não foi usado na query principal
    if (subjectId && !title && !professorName && !tags) {
      filtered = filtered.filter(
        project => project.subjectId?.toString() === subjectId,
      )
    }

    // Filtrar por ano se especificado e não foi usado na query principal
    if (publishedYear && !title && !professorName && !tags) {
      filtered = filtered.filter(
        project => project.publishedYear === publishedYear,
      )
    }

    // Filtrar por semestre se especificado e não foi usado na query principal
    if (semester && !title && !professorName && !tags) {
      filtered = filtered.filter(project => project.semester === semester)
    }

    // Paginação em memória
    const total = filtered.length
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginated = filtered.slice(startIndex, endIndex)

    return right({
      projects: paginated,
      total,
    })
  }
}
