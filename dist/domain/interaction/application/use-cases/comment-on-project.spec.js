"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _makeproject = require("../../../../../test/factories/make-project");
const _makeuser = require("../../../../../test/factories/make-user");
const _projectsrepository = require("../../../../../test/repositories/projects-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _commentonproject = require("./comment-on-project");
const _commentsrepository = require("../../../../../test/repositories/comments-repository");
let usersRepository;
let projectsRepository;
let commentsRepository;
let author;
let project;
let sut;
describe('comment on project use case', ()=>{
    beforeEach(async ()=>{
        usersRepository = new _usersrepository.InMemoryUsersRepository();
        projectsRepository = new _projectsrepository.InMemoryProjectsRepository();
        commentsRepository = new _commentsrepository.InMemoryCommentsRepository(usersRepository);
        author = await (0, _makeuser.makeUser)();
        project = (0, _makeproject.makeProject)();
        await usersRepository.create(author);
        await projectsRepository.create(project);
        sut = new _commentonproject.CommentOnProjectUseCase(projectsRepository, usersRepository, commentsRepository);
    });
    it('should be able to comment on a project', async ()=>{
        const result = await sut.execute({
            authorId: author.id.toString(),
            projectId: project.id.toString(),
            content: 'Parabéns pelo projeto!'
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual(expect.objectContaining({
            commentId: expect.any(String)
        }));
    });
});

//# sourceMappingURL=comment-on-project.spec.js.map