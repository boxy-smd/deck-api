import { type Either, right } from '@/@shared/kernel/either'
import {
  Pagination,
  type PaginatedResult,
} from '@/@shared/kernel/pagination'
import { PostSummary } from '../../enterprise/value-objects/post-summary'
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
  PaginatedResult<PostSummary>
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

    const posts = await this.searchContext.search(
      criteria,
      this.projectsRepository,
    )

    const postSummaries = posts.map(post => PostSummary.fromPost(post))

    const paginatedResult = Pagination.paginate(postSummaries, {
      page,
      perPage,
    })

    return right(paginatedResult)
  }
}
