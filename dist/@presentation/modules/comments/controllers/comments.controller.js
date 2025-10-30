"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommentsController", {
    enumerable: true,
    get: function() {
        return CommentsController;
    }
});
const _makecommentonprojectusecase = require("../../../../@core/application/factories/comments/make-comment-on-project-use-case");
const _makedeletecommentusecase = require("../../../../@core/application/factories/comments/make-delete-comment-use-case");
const _makelistprojectcommentsusecase = require("../../../../@core/application/factories/comments/make-list-project-comments-use-case");
const _makereportcommentusecase = require("../../../../@core/application/factories/comments/make-report-comment-use-case");
const _jwtauthguard = require("../../auth/guards/jwt-auth.guard");
const _comment = require("../../../presenters/comment");
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let CommentsController = class CommentsController {
    async listProjectComments(projectId) {
        const listProjectCommentsUseCase = (0, _makelistprojectcommentsusecase.makeListProjectCommentsUseCase)();
        const result = await listProjectCommentsUseCase.execute({
            projectId
        });
        if (result.isLeft()) {
            const error = result.value;
            if (error.statusCode === 404) {
                throw new _common.NotFoundException(error.message);
            }
            throw new _common.BadRequestException(error.message);
        }
        return {
            comments: result.value.comments.map(_comment.CommentPresenter.toHTTP)
        };
    }
    async commentOnProject(projectId, dto, req) {
        const commentOnProjectUseCase = (0, _makecommentonprojectusecase.makeCommentOnProjectUseCase)();
        const result = await commentOnProjectUseCase.execute({
            projectId,
            content: dto.content,
            authorId: req.user.userId
        });
        if (result.isLeft()) {
            const error = result.value;
            if (error.statusCode === 404) {
                throw new _common.NotFoundException(error.message);
            }
            if (error.statusCode === 403) {
                throw new _common.ForbiddenException(error.message);
            }
            throw new _common.BadRequestException(error.message);
        }
        return {
            comment_id: result.value.commentId
        };
    }
    async deleteComment(projectId, commentId, req) {
        const deleteCommentUseCase = (0, _makedeletecommentusecase.makeDeleteCommentUseCase)();
        const result = await deleteCommentUseCase.execute({
            authorId: req.user.userId,
            commentId,
            projectId
        });
        if (result.isLeft()) {
            const error = result.value;
            if (error.statusCode === 404) {
                throw new _common.NotFoundException(error.message);
            }
            if (error.statusCode === 403) {
                throw new _common.ForbiddenException(error.message);
            }
            throw new _common.BadRequestException(error.message);
        }
    }
    async reportComment(commentId, dto, req) {
        const reportCommentUseCase = (0, _makereportcommentusecase.makeReportCommentUseCase)();
        const result = await reportCommentUseCase.execute({
            authorId: req.user.userId,
            commentId,
            projectId: dto.projectId,
            content: dto.content
        });
        if (result.isLeft()) {
            const error = result.value;
            if (error.statusCode === 404) {
                throw new _common.NotFoundException(error.message);
            }
            throw new _common.BadRequestException(error.message);
        }
        return {
            message: 'Comment reported successfully.'
        };
    }
};
_ts_decorate([
    (0, _common.Get)('projects/:projectId/comments'),
    (0, _swagger.ApiOperation)({
        summary: 'List project comments'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Comments retrieved successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Project not found'
    }),
    _ts_param(0, (0, _common.Param)('projectId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CommentsController.prototype, "listProjectComments", null);
_ts_decorate([
    (0, _common.Post)('projects/:projectId/comments'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Comment on a project'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Comment created successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Project not found'
    }),
    _ts_param(0, (0, _common.Param)('projectId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof CommentOnProjectDto === "undefined" ? Object : CommentOnProjectDto,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], CommentsController.prototype, "commentOnProject", null);
_ts_decorate([
    (0, _common.Delete)('projects/:projectId/comments/:commentId'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.HttpCode)(_common.HttpStatus.NO_CONTENT),
    (0, _swagger.ApiOperation)({
        summary: 'Delete a comment'
    }),
    (0, _swagger.ApiResponse)({
        status: 204,
        description: 'Comment deleted successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 403,
        description: 'Forbidden'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Comment not found'
    }),
    _ts_param(0, (0, _common.Param)('projectId')),
    _ts_param(1, (0, _common.Param)('commentId')),
    _ts_param(2, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], CommentsController.prototype, "deleteComment", null);
_ts_decorate([
    (0, _common.Post)('comments/:commentId/report'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Report a comment'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Comment reported successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Comment not found'
    }),
    _ts_param(0, (0, _common.Param)('commentId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof ReportCommentDto === "undefined" ? Object : ReportCommentDto,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], CommentsController.prototype, "reportComment", null);
CommentsController = _ts_decorate([
    (0, _swagger.ApiTags)('Comments'),
    (0, _common.Controller)()
], CommentsController);

//# sourceMappingURL=comments.controller.js.map