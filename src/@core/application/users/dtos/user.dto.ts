import type { Trail } from '@/@core/domain/projects/entities/trail'
import type { UserRole } from '@/@core/domain/users/value-objects/user-role'
import type { UserStatus } from '@/@core/domain/users/value-objects/user-status'
import type { User } from '../../../domain/users/entities/user'
import type { ProjectSummaryDTO } from '../../projects/dtos/project-summary.dto'

export interface UserDTO {
  id: string
  name: string
  username: string
  email: string
  about: string | null
  profileUrl: string | null
  semester: number
  trails: string[]
  role: UserRole
  status: UserStatus
  posts: ProjectSummaryDTO[]
  drafts: ProjectSummaryDTO[]
}

export class UserDTOMapper {
  static toDTO(
    user: User,
    trails?: Trail[],
    posts: ProjectSummaryDTO[] = [],
    drafts: ProjectSummaryDTO[] = [],
  ): UserDTO {
    return {
      id: user.id.toString(),
      name: user.name,
      username: user.username.value,
      email: user.email.value,
      about: user.about ?? null,
      profileUrl: user.profileUrl ?? null,
      semester: user.profile?.semester.value ?? 0,
      trails: trails?.map(trail => trail.id.toString()) || [],
      role: user.role,
      status: user.status,
      posts,
      drafts,
    }
  }
}
