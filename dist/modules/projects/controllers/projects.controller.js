"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProjectsController", {
    enumerable: true,
    get: function() {
        return ProjectsController;
    }
});
const _makedeleteprojectusecase = require("../../../interface/factories/projects/make-delete-project-use-case");
const _makefetchpostsusecase = require("../../../interface/factories/projects/make-fetch-posts-use-case");
const _makefilterpostsbyqueryusecase = require("../../../interface/factories/projects/make-filter-posts-by-query-use-case");
const _makegetprojectusecase = require("../../../interface/factories/projects/make-get-project-use-case");
const _makepublishprojectusecase = require("../../../interface/factories/projects/make-publish-project-use-case");
const _makesearchpostsbyprofessornameusecase = require("../../../interface/factories/projects/make-search-posts-by-professor-name-use-case");
const _makesearchpostsbytagusecase = require("../../../interface/factories/projects/make-search-posts-by-tag-use-case");
const _makesearchpostsbytitleusecase = require("../../../interface/factories/projects/make-search-posts-by-title-use-case");
const _makeuploadprojectbannerusecase = require("../../../interface/factories/projects/make-upload-project-banner-use-case");
const _post = require("../../../interface/http/presenters/post");
const _projectdetails = require("../../../interface/http/presenters/project-details");
const _jwtauthguard = require("../../auth/guards/jwt-auth.guard");
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
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
let ProjectsController = class ProjectsController {
    async publishProject(dto, req) {
        const publishProjectUseCase = (0, _makepublishprojectusecase.makePublishProjectUseCase)();
        const result = await publishProjectUseCase.execute({
            title: dto.title,
            description: dto.description,
            bannerUrl: dto.bannerUrl,
            content: dto.content,
            publishedYear: dto.publishedYear,
            semester: dto.semester,
            allowComments: dto.allowComments,
            authorId: req.user.userId,
            subjectId: dto.subjectId,
            trailsIds: dto.trailsIds,
            professorsIds: dto.professorsIds,
            draftId: dto.draftId
        });
        if (result.isLeft()) {
            const error = result.value;
            if (error.statusCode === 404) {
                throw new _common.NotFoundException(error.message);
            }
            if (error.statusCode === 409) {
                throw new _common.ConflictException(error.message);
            }
            throw new _common.BadRequestException(error.message);
        }
        return {
            project_id: result.value.projectId
        };
    }
    async fetchPosts(query) {
        const fetchPostsUseCase = (0, _makefetchpostsusecase.makeFetchPostsUseCase)();
        const result = await fetchPostsUseCase.execute();
        return {
            posts: result.map(_post.PostPresenter.toHTTP)
        };
    }
    async filterPosts(filter) {
        let posts = [];
        if (filter.query) {
            const filterPostsUseCase = (0, _makefilterpostsbyqueryusecase.makeFilterPostsByQueryUseCase)();
            const result = await filterPostsUseCase.execute({
                query: filter.query
            });
            if (result.isRight()) {
                posts = result.value;
            }
        } else if (filter.title) {
            const searchUseCase = (0, _makesearchpostsbytitleusecase.makeSearchPostsByTitleUseCase)();
            const result = await searchUseCase.execute({
                title: filter.title
            });
            posts = result;
        } else if (filter.professor) {
            const searchUseCase = (0, _makesearchpostsbyprofessornameusecase.makeSearchPostsByProfessorNameUseCase)();
            const result = await searchUseCase.execute({
                professorName: filter.professor
            });
            posts = result;
        } else if (filter.tag) {
            const searchUseCase = (0, _makesearchpostsbytagusecase.makeSearchPostsByTagUseCase)();
            const result = await searchUseCase.execute({
                tag: filter.tag
            });
            posts = result;
        } else {
            const fetchPostsUseCase = (0, _makefetchpostsusecase.makeFetchPostsUseCase)();
            const result = await fetchPostsUseCase.execute();
            if (result.isRight()) {
                posts = result.value;
            }
        }
        return {
            posts: posts.map(_post.PostPresenter.toHTTP)
        };
    }
    async getProject(projectId) {
        const getProjectUseCase = (0, _makegetprojectusecase.makeGetProjectUseCase)();
        const result = await getProjectUseCase.execute({
            projectId
        });
        if (result.isLeft()) {
            const error = result.value;
            if (error.statusCode === 404) {
                throw new _common.NotFoundException(error.message);
            }
            throw new _common.BadRequestException(error.message);
        }
        return _projectdetails.ProjectDetailsPresenter.toHTTP(result.value);
    }
    async deleteProject(projectId, req) {
        const deleteProjectUseCase = (0, _makedeleteprojectusecase.makeDeleteProjectUseCase)();
        const result = await deleteProjectUseCase.execute({
            projectId,
            studentId: req.user.userId
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
    async uploadBanner(projectId, file) {
        if (!file) {
            throw new _common.BadRequestException('File is required');
        }
        const uploadUseCase = (0, _makeuploadprojectbannerusecase.makeUploadProjectBannerUseCase)();
        const result = await uploadUseCase.execute({
            projectId,
            filename: file.originalname,
            image: file.buffer
        });
        if (result.isLeft()) {
            const error = result.value;
            if (error.statusCode === 404) {
                throw new _common.NotFoundException(error.message);
            }
            throw new _common.BadRequestException(error.message);
        }
        return {
            message: 'Banner uploaded successfully'
        };
    }
};
_ts_decorate([
    (0, _common.Post)('projects'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Publish a project'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Project published successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Bad request'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Resource not found'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof PublishProjectDto === "undefined" ? Object : PublishProjectDto,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ProjectsController.prototype, "publishProject", null);
_ts_decorate([
    (0, _common.Get)('posts'),
    (0, _swagger.ApiOperation)({
        summary: 'Fetch posts'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Posts retrieved successfully'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FetchPostsDto === "undefined" ? Object : FetchPostsDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ProjectsController.prototype, "fetchPosts", null);
_ts_decorate([
    (0, _common.Get)('posts/search'),
    (0, _swagger.ApiOperation)({
        summary: 'Search/Filter posts'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Posts retrieved successfully'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FilterPostsDto === "undefined" ? Object : FilterPostsDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ProjectsController.prototype, "filterPosts", null);
_ts_decorate([
    (0, _common.Get)('projects/:projectId'),
    (0, _swagger.ApiOperation)({
        summary: 'Get project details'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Project retrieved successfully'
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
], ProjectsController.prototype, "getProject", null);
_ts_decorate([
    (0, _common.Delete)('projects/:projectId'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.HttpCode)(_common.HttpStatus.NO_CONTENT),
    (0, _swagger.ApiOperation)({
        summary: 'Delete a project'
    }),
    (0, _swagger.ApiResponse)({
        status: 204,
        description: 'Project deleted successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 403,
        description: 'Forbidden'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Project not found'
    }),
    _ts_param(0, (0, _common.Param)('projectId')),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ProjectsController.prototype, "deleteProject", null);
_ts_decorate([
    (0, _common.Post)('projects/:projectId/banner'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiConsumes)('multipart/form-data'),
    (0, _swagger.ApiOperation)({
        summary: 'Upload project banner'
    }),
    (0, _swagger.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Banner uploaded successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Project not found'
    }),
    _ts_param(0, (0, _common.Param)('projectId')),
    _ts_param(1, (0, _common.UploadedFile)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File
    ]),
    _ts_metadata("design:returntype", Promise)
], ProjectsController.prototype, "uploadBanner", null);
ProjectsController = _ts_decorate([
    (0, _swagger.ApiTags)('Projects'),
    (0, _common.Controller)()
], ProjectsController);

//# sourceMappingURL=projects.controller.js.map