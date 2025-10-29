"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "publishProject", {
    enumerable: true,
    get: function() {
        return publishProject;
    }
});
const _makepublishprojectusecase = require("../../../factories/projects/make-publish-project-use-case");
async function publishProject(request, reply) {
    const authorId = request.user.sign.sub;
    const { title, description, bannerUrl, content, publishedYear, semester, allowComments, subjectId, trailsIds, professorsIds, draftId } = request.body;
    const publishProjectUseCase = (0, _makepublishprojectusecase.makePublishProjectUseCase)();
    const result = await publishProjectUseCase.execute({
        title,
        description,
        bannerUrl,
        content,
        publishedYear,
        semester,
        allowComments,
        authorId,
        subjectId,
        trailsIds,
        professorsIds,
        draftId
    });
    if (result.isLeft()) {
        const error = result.value;
        return reply.status(error.statusCode).send({
            message: error.message
        });
    }
    return reply.status(201).send({
        project_id: result.value.projectId
    });
}

//# sourceMappingURL=publish.controller.js.map