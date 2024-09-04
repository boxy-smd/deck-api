import { makeProjectTrail } from 'test/factories/make-project-trails.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { InMemoryProjectCommentsRepository } from 'test/repositories/project-comments-repository.ts'
import { InMemoryProjectProfessorsRepository } from 'test/repositories/project-professors-repository.ts'
import { InMemoryProjectTrailsRepository } from 'test/repositories/project-trails-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryStudentTrailsRepository } from 'test/repositories/student-trails-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { ProjectTrailList } from '../../enterprise/entities/project-trail-list.ts'
import type { ProjectTrail } from '../../enterprise/entities/project-trail.ts'
import type { Project } from '../../enterprise/entities/project.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { GetProjectsFeedUseCase } from './get-projects-feed.ts'

let projectsRepository: InMemoryProjectsRepository
let studentsRepository: InMemoryStudentsRepository
let studentTrailsRepository: InMemoryStudentTrailsRepository
let subjectsRepository: InMemorySubjectsRepository
let projectTrailsRepository: InMemoryProjectTrailsRepository
let projectProfessorsRepository: InMemoryProjectProfessorsRepository
let projectCommentsRepository: InMemoryProjectCommentsRepository
let trailsRepository: InMemoryTrailsRepository
let professorsRepository: InMemoryProfessorsRepository
let author: Student
let trail: Trail
let project: Project
let projectTrail: ProjectTrail

let sut: GetProjectsFeedUseCase

describe('get projects feed use case', () => {
  beforeEach(async () => {
    studentTrailsRepository = new InMemoryStudentTrailsRepository()
    studentsRepository = new InMemoryStudentsRepository(studentTrailsRepository)
    projectTrailsRepository = new InMemoryProjectTrailsRepository()
    projectProfessorsRepository = new InMemoryProjectProfessorsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()
    projectCommentsRepository = new InMemoryProjectCommentsRepository()

    projectsRepository = new InMemoryProjectsRepository(
      projectTrailsRepository,
      projectProfessorsRepository,
      projectCommentsRepository,
      studentsRepository,
      subjectsRepository,
      trailsRepository,
      professorsRepository,
    )

    author = await makeStudent()
    trail = makeTrail()

    project = makeProject({
      authorId: author.id,
    })

    projectTrail = makeProjectTrail({
      trailId: trail.id,
      projectId: project.id,
    })

    project.trails = new ProjectTrailList([projectTrail])

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await projectTrailsRepository.create(projectTrail)

    sut = new GetProjectsFeedUseCase(projectsRepository)
  })

  it('should be able to return the projects feed', async () => {
    await projectsRepository.create(project)

    const result = await sut.execute()

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })
})
