import type { UserDTO } from '@/@core/application/users/dtos/user.dto'
import type { UserSummaryDTO } from '@/@core/application/users/dtos/user.summary.dto'
import { ProjectPresenter } from './project'

export class UserPresenter {
  static toHTTP(user: UserDTO) {
    return {
      id: user.id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      about: user.about,
      profileUrl: user.profileUrl,
      semester: user.semester,
      trails: user.trails,
      role: user.role,
      status: user.status,
      posts: user.posts.map(ProjectPresenter.summaryToHTTP),
      drafts: user.drafts.map(ProjectPresenter.summaryToHTTP),
    }
  }

  static summaryToHTTP(user: UserSummaryDTO) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      about: user.about,
      profileUrl: user.profileUrl,
      semester: user.semester,
      trails: user.trails,
      role: user.role,
    }
  }
}
