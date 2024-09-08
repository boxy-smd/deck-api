import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { deleteProject } from '../controllers/projects/delete.controller.ts'
import { editProject } from '../controllers/projects/edit.controller.ts'
import { publishProject } from '../controllers/projects/publish.controller.ts'
import { deleteProjectSchemas } from '../schemas/projects/delete.schemas.ts'
import { editProjectSchemas } from '../schemas/projects/edit.schemas.ts'
import { publishProjectSchemas } from '../schemas/projects/publish.schemas.ts'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function projectsRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/projects', { schema: publishProjectSchemas }, publishProject)

  app
    .withTypeProvider<ZodTypeProvider>()
    .put('/projects/:projectId', { schema: editProjectSchemas }, editProject)

  app
    .withTypeProvider<ZodTypeProvider>()
    .delete(
      '/projects/:projectId',
      { schema: deleteProjectSchemas },
      deleteProject,
    )
}
