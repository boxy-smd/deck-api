import { type Either, right } from '@/@shared/kernel/either'
import {
  type PaginatedResult,
  Pagination,
} from '@/@shared/kernel/pagination'
import type { ProjectSummaryDTO } from '../dtos/project-summary.dto'
import type { ProjectsRepository } from '../repositories/projects-repository'
import { SearchContext } from '../search-strategies/search-context'
import type { SearchCriteria } from '../search-strategies/search-strategy'

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
  PaginatedResult<ProjectSummaryDTO>
>

export class SearchProjectsUseCase {
  private readonly searchContext: SearchContext

  constructor(private readonly projectsRepository: ProjectsRepository) {
    this.searchContext = new SearchContext()
  }

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
      page,
      perPage,
    } = request

    const criteria: SearchCriteria = {
      query,
      title,
      tags,
      professorName,
      trailsIds,
      subjectId,
      publishedYear,
      semester,
    }

    const projects = await this.searchContext.search(
      criteria,
      this.projectsRepository,
    )

    const projectSummaries: ProjectSummaryDTO[] = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      bannerUrl: project.bannerUrl,
      publishedYear: project.publishedYear,
      semester: project.semester,
      createdAt: project.createdAt,
      author: project.author,
      subject: project.subject,
      trails: project.trails,
    }))

    const paginatedResult = Pagination.paginate(projectSummaries, {
      page,
      perPage,
    })

    return right(paginatedResult)
  }
}
