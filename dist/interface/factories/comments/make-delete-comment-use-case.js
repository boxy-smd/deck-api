"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeDeleteCommentUseCase", {
    enumerable: true,
    get: function() {
        return makeDeleteCommentUseCase;
    }
});
const _deletecomment = require("../../../domain/interaction/application/use-cases/delete-comment");
const _commentsrepository = require("../../../infra/database/prisma/repositories/comments-repository");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
const _reportsrepository = require("../../../infra/database/prisma/repositories/reports-repository");
const _studentsrepository = require("../../../infra/database/prisma/repositories/students-repository");
function makeDeleteCommentUseCase() {
    const reportsRepository = new _reportsrepository.PrismaReportsRepository();
    const commentsRepository = new _commentsrepository.PrismaCommentsRepository(reportsRepository);
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const studentsRepository = new _studentsrepository.PrismaStudentsRepository(projectsRepository);
    const deleteCommentUseCase = new _deletecomment.DeleteCommentUseCase(commentsRepository, studentsRepository);
    return deleteCommentUseCase;
}

//# sourceMappingURL=make-delete-comment-use-case.js.map