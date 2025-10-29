"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "deleteProject", {
    enumerable: true,
    get: function() {
        return deleteProject;
    }
});
const _makedeleteprojectusecase = require("../../../factories/projects/make-delete-project-use-case");
async function deleteProject(request, reply) {
    const studentId = request.user.sign.sub;
    const { projectId } = request.params;
    const deleteProjectUseCase = (0, _makedeleteprojectusecase.makeDeleteProjectUseCase)();
    const result = await deleteProjectUseCase.execute({
        studentId,
        projectId
    });
    if (result.isLeft()) {
        const error = result.value;
        return reply.status(error.statusCode).send({
            message: error.message
        });
    }
    return reply.status(204).send();
}

//# sourceMappingURL=delete.controller.js.map