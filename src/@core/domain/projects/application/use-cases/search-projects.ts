import { type Either, right } from '@/@shared/kernel/either'
import { type PaginatedResult, Pagination } from '@/@shared/kernel/pagination'
import type { ProjectSummaryDTO } from '../dtos/project-summary.dto'
import type { ProjectDTO } from '../dtos/project.dto'
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

    const projectDTOs = await this.searchContext.search(
      criteria,
      this.projectsRepository,
    )

    const projectSummaries: ProjectSummaryDTO[] = projectDTOs.map(dto =>
      this.mapToSummary(dto),
    )

    const paginatedResult = Pagination.paginate(projectSummaries, {
      page,
      perPage,
    })

    return right(paginatedResult)
  }

  private mapToSummary(dto: ProjectDTO): ProjectSummaryDTO {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      bannerUrl: dto.bannerUrl,
      publishedYear: dto.publishedYear,
      semester: dto.semester,
      createdAt: dto.createdAt,
      author: dto.author,
      subject: dto.subject,
      trails: dto.trails,
    }
  }
}
