"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "commentOnProject", {
    enumerable: true,
    get: function() {
        return commentOnProject;
    }
});
const _makecommentonprojectusecase = require("../../../factories/comments/make-comment-on-project-use-case");
async function commentOnProject(request, reply) {
    const { projectId } = request.params;
    const { content } = request.body;
    const commentOnProjectUseCase = (0, _makecommentonprojectusecase.makeCommentOnProjectUseCase)();
    const result = await commentOnProjectUseCase.execute({
        projectId,
        content,
        authorId: request.user.sign.sub
    });
    if (result.isLeft()) {
        const error = result.value;
        return reply.code(error.statusCode).send(error);
    }
    return reply.code(201).send({
        comment_id: result.value.commentId
    });
}

//# sourceMappingURL=comment-on-project.controller.js.map