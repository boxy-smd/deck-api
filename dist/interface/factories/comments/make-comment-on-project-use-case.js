"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeCommentOnProjectUseCase", {
    enumerable: true,
    get: function() {
        return makeCommentOnProjectUseCase;
    }
});
const _commentonproject = require("../../../domain/interaction/application/use-cases/comment-on-project");
const _commentsrepository = require("../../../infra/database/prisma/repositories/comments-repository");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
const _reportsrepository = require("../../../infra/database/prisma/repositories/reports-repository");
const _studentsrepository = require("../../../infra/database/prisma/repositories/students-repository");
function makeCommentOnProjectUseCase() {
    const reportsRepository = new _reportsrepository.PrismaReportsRepository();
    const commentsRepository = new _commentsrepository.PrismaCommentsRepository(reportsRepository);
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const studentsRepository = new _studentsrepository.PrismaStudentsRepository(projectsRepository);
    const commentOnProjectUseCase = new _commentonproject.CommentOnProjectUseCase(projectsRepository, studentsRepository, commentsRepository);
    return commentOnProjectUseCase;
}

//# sourceMappingURL=make-comment-on-project-use-case.js.map