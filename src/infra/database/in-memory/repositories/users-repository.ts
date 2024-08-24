import type {
  UpdateUserRequest,
  UsersRepository,
} from '@/application/repositories/users-repository.ts'
import type { User } from '@/domain/entities/user.entity.ts'

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = []

  create(user: User): Promise<User> {
    this.users.push(user)
    return Promise.resolve(user)
  }

  findById(id: string): Promise<User | null> {
    const user = this.users.find(user => user.id === id)
    return Promise.resolve(user ?? null)
  }

  findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(user => user.email === email)
    return Promise.resolve(user ?? null)
  }

  findByUsername(username: string): Promise<User | null> {
    const user = this.users.find(user => user.username === username)
    return Promise.resolve(user ?? null)
  }

  findByName(name: string): Promise<User[]> {
    const users = this.users.filter(user => user.name.includes(name))
    return Promise.resolve(users)
  }

  update(
    id: string,
    { about, semester, profileUrl }: UpdateUserRequest,
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

    user.updatedAt = new Date()

    return Promise.resolve(user)
  }

  delete(id: string): Promise<void> {
    this.users = this.users.filter(user => user.id !== id)
    return Promise.resolve()
  }
}
