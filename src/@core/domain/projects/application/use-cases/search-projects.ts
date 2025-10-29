import type { PaginatedResult } from '@/@shared/kernel/dtos/pagination.dto'
import { PaginationDTO } from '@/@shared/kernel/dtos/pagination.dto'
import { type Either, right } from '@/@shared/kernel/either'
import {
  type ProjectSummaryDTO,
  ProjectSummaryDTOMapper,
} from '../dtos/project-summary.dto'
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

    const projectSummaries = projects.map(project =>
      ProjectSummaryDTOMapper.fromProject(project),
    )

    const { page: validPage, limit } = PaginationDTO.validateParams({
      page,
      limit: perPage,
    })

    const paginatedResult = PaginationDTO.create(
      projectSummaries,
      projectSummaries.length,
      validPage,
      limit,
    )

    return right(paginatedResult)
  }
}
