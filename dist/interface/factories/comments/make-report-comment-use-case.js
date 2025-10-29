"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeReportCommentUseCase", {
    enumerable: true,
    get: function() {
        return makeReportCommentUseCase;
    }
});
const _reportcomment = require("../../../domain/interaction/application/use-cases/report-comment");
const _commentsrepository = require("../../../infra/database/prisma/repositories/comments-repository");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
const _reportsrepository = require("../../../infra/database/prisma/repositories/reports-repository");
const _studentsrepository = require("../../../infra/database/prisma/repositories/students-repository");
function makeReportCommentUseCase() {
    const reportsRepository = new _reportsrepository.PrismaReportsRepository();
    const commentsRepository = new _commentsrepository.PrismaCommentsRepository(reportsRepository);
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const studentsRepository = new _studentsrepository.PrismaStudentsRepository(projectsRepository);
    const reportCommentUseCase = new _reportcomment.ReportCommentUseCase(studentsRepository, commentsRepository, reportsRepository);
    return reportCommentUseCase;
}

//# sourceMappingURL=make-report-comment-use-case.js.map