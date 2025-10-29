"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getProject", {
    enumerable: true,
    get: function() {
        return getProject;
    }
});
const _makegetprojectusecase = require("../../../factories/projects/make-get-project-use-case");
const _projectdetails = require("../../presenters/project-details");
async function getProject(request, reply) {
    const { projectId } = request.params;
    const getProjectUseCase = (0, _makegetprojectusecase.makeGetProjectUseCase)();
    const result = await getProjectUseCase.execute({
        projectId
    });
    if (result.isLeft()) {
        const error = result.value;
        return reply.status(error.statusCode).send({
            message: error.message
        });
    }
    return reply.status(200).send({
        project: _projectdetails.ProjectDetailsPresenter.toHTTP(result.value)
    });
}

//# sourceMappingURL=get.controller.js.map