"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "reportComment", {
    enumerable: true,
    get: function() {
        return reportComment;
    }
});
const _makereportcommentusecase = require("../../../factories/comments/make-report-comment-use-case");
async function reportComment(request, reply) {
    const { commentId } = request.params;
    const { content, projectId } = request.body;
    const authorId = request.user.sign.sub;
    const reportCommentUseCase = (0, _makereportcommentusecase.makeReportCommentUseCase)();
    const result = await reportCommentUseCase.execute({
        authorId,
        commentId,
        projectId,
        content
    });
    if (result.isLeft()) {
        const error = result.value;
        return reply.status(error.statusCode).send(error.message);
    }
    return reply.status(201).send({
        message: 'Comment reported successfully.'
    });
}

//# sourceMappingURL=report.controller.js.map