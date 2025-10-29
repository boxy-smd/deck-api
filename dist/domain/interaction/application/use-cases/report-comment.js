"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReportCommentUseCase", {
    enumerable: true,
    get: function() {
        return ReportCommentUseCase;
    }
});
const _either = require("../../../../shared/either");
const _forbiddenerror = require("../../../../shared/errors/forbidden.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
const _report = require("../../enterprise/entities/report");
let ReportCommentUseCase = class ReportCommentUseCase {
    async execute({ content, authorId, projectId, commentId }) {
        if (!authorId) {
            return (0, _either.left)(new _forbiddenerror.ForbiddenError('You must be logged in to report a comment.'));
        }
        const comment = await this.commentsRepository.findById(commentId);
        if (!comment) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Comment not found.'));
        }
        if (comment.projectId.toString() !== projectId) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Comment not found in this project.'));
        }
        const student = await this.studentsRepository.findById(authorId);
        if (!student) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Student not found.'));
        }
        const report = _report.Report.create({
            content,
            authorId: student.id,
            commentId: comment.id,
            isResolved: false
        });
        await this.reportsRepository.create(report);
        return (0, _either.right)(undefined);
    }
    constructor(studentsRepository, commentsRepository, reportsRepository){
        this.studentsRepository = studentsRepository;
        this.commentsRepository = commentsRepository;
        this.reportsRepository = reportsRepository;
    }
};

//# sourceMappingURL=report-comment.js.map