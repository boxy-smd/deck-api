import { makeProjectComment } from 'test/factories/make-project-comment.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeStudentTrail } from 'test/factories/make-student-trail.ts'
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
import { ProjectCommentList } from '../../enterprise/entities/project-comment-list.ts'
import type { ProjectComment } from '../../enterprise/entities/project-comment.ts'
import type { Project } from '../../enterprise/entities/project.ts'
import { StudentTrailList } from '../../enterprise/entities/student-trail-list.ts'
import type { StudentTrail } from '../../enterprise/entities/student-trail.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { FetchProjectCommentsUseCase } from './fetch-project-comments.ts'

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
let studentTrail: StudentTrail
let project: Project
let projectComment: ProjectComment

let sut: FetchProjectCommentsUseCase

describe('fetch project comments use case', () => {
  beforeEach(async () => {
    studentTrailsRepository = new InMemoryStudentTrailsRepository()
    studentsRepository = new InMemoryStudentsRepository(studentTrailsRepository)
    projectTrailsRepository = new InMemoryProjectTrailsRepository()
    projectProfessorsRepository = new InMemoryProjectProfessorsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()
    projectCommentsRepository = new InMemoryProjectCommentsRepository(
      studentsRepository,
    )

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
    project = makeProject()
    studentTrail = makeStudentTrail({
      studentId: author.id,
      trailId: trail.id,
    })

    author.trails = new StudentTrailList([studentTrail])

    projectComment = makeProjectComment({
      projectId: project.id,
      authorId: author.id,
    })

    project.comments = new ProjectCommentList([projectComment])

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await projectsRepository.create(project)
    await projectCommentsRepository.create(projectComment)

    sut = new FetchProjectCommentsUseCase(projectCommentsRepository)
  })

  it('should be able to fetch project comments', async () => {
    await studentsRepository.create(author)

    const result = await sut.execute({
      projectId: project.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value.comments).toHaveLength(1)
    expect(result.isRight() && result.value.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content: 'Great job!',
        }),
      ]),
    )
  })
})
