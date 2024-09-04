import { WatchedList } from '@/core/entities/watched-list.ts'
import type { ProjectProfessor } from './project-professor.ts'

export class ProjectProfessorList extends WatchedList<ProjectProfessor> {
  public compareItems(a: ProjectProfessor, b: ProjectProfessor): boolean {
    return a.professorId === b.professorId
  }
}
