"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "deleteComment", {
    enumerable: true,
    get: function() {
        return deleteComment;
    }
});
const _makedeletecommentusecase = require("../../../factories/comments/make-delete-comment-use-case");
async function deleteComment(request, reply) {
    const authorId = request.user.sign.sub;
    const { commentId, projectId } = request.params;
    const deleteCommentUseCase = (0, _makedeletecommentusecase.makeDeleteCommentUseCase)();
    const result = await deleteCommentUseCase.execute({
        authorId,
        commentId,
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