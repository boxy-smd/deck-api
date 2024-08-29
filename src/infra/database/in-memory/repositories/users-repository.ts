import type {
  UpdateUserRequest,
  UsersRepository,
} from '@/application/repositories/users-repository.ts'
import type { User } from '@/domain/entities/user.entity.ts'

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = []

  async create(user: User): Promise<User> {
    this.users.push(user)
    return await Promise.resolve(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(user => user.id === id)
    return await Promise.resolve(user ?? null)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(user => user.email.value === email)
    return await Promise.resolve(user ?? null)
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.users.find(user => user.username === username)
    return await Promise.resolve(user ?? null)
  }

  async fetchByQuery(query: { name?: string; username?: string }): Promise<
    User[]
  > {
    const users = this.users.filter(user => {
      if (query.name && !user.name.includes(query.name)) return false
      if (query.username && !user.username.includes(query.username))
        return false
      return true
    })

    return await Promise.resolve(users)
  }

  async update(
    id: string,
    { about, semester, profileUrl, trails }: UpdateUserRequest,
  ): Promise<User | null> {
    const user = this.users.find(user => user.id === id)

    if (!user) return Promise.resolve(null)

    if (about) {
      user.about = about
    }

    if (semester) {
      user.semester = semester
    }

    if (profileUrl) {
      user.profileUrl = profileUrl
    }

    if (trails) {
      user.trails = trails
    }

    user.updatedAt = new Date()

    return Promise.resolve(user)
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(user => user.id !== id)
    return await Promise.resolve()
  }
}
