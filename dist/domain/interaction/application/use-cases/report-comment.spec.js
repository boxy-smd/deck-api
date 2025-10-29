"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _forbiddenerror = require("../../../../shared/errors/forbidden.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
const _makeproject = require("../../../../../test/factories/make-project");
const _makeuser = require("../../../../../test/factories/make-user");
const _commentsrepository = require("../../../../../test/repositories/comments-repository");
const _projectsrepository = require("../../../../../test/repositories/projects-repository");
const _reportsrepository = require("../../../../../test/repositories/reports-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _reportcomment = require("./report-comment");
let studentsRepository;
let projectsRepository;
let commentsRepository;
let reportsRepository;
let author;
let project;
let comment;
let sut;
describe('report comment use case', ()=>{
    beforeEach(async ()=>{
        studentsRepository = new _usersrepository.InMemoryUsersRepository();
        projectsRepository = new _projectsrepository.InMemoryProjectsRepository();
        commentsRepository = new _commentsrepository.InMemoryCommentsRepository(studentsRepository);
        reportsRepository = new _reportsrepository.InMemoryReportsRepository();
        author = await (0, _makeuser.makeUser)();
        project = (0, _makeproject.makeProject)();
        comment = project.comment('Teste', author.id);
        await studentsRepository.create(author);
        await projectsRepository.create(project);
        await commentsRepository.create(comment);
        sut = new _reportcomment.ReportCommentUseCase(studentsRepository, commentsRepository, reportsRepository);
    });
    it('should be able to report a comment', async ()=>{
        const result = await sut.execute({
            content: 'This comment is inappropriate.',
            authorId: author.id.toString(),
            projectId: project.id.toString(),
            commentId: comment.id.toString()
        });
        expect(result.isRight()).toBe(true);
    });
    it('should not be able to report a comment with an invalid author', async ()=>{
        const result = await sut.execute({
            content: 'This comment is inappropriate.',
            authorId: '',
            projectId: project.id.toString(),
            commentId: comment.id.toString()
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(_forbiddenerror.ForbiddenError);
    });
    it('should not be able to report a comment with an invalid comment id', async ()=>{
        const result = await sut.execute({
            content: 'This comment is inappropriate.',
            authorId: '123',
            projectId: project.id.toString(),
            commentId: 'invalid-id'
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
});

//# sourceMappingURL=report-comment.spec.js.map