"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _forbiddenerror = require("../../../../shared/errors/forbidden.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
const _makeproject = require("../../../../../test/factories/make-project");
const _maketrail = require("../../../../../test/factories/make-trail");
const _makeuser = require("../../../../../test/factories/make-user");
const _commentsrepository = require("../../../../../test/repositories/comments-repository");
const _projectsrepository = require("../../../../../test/repositories/projects-repository");
const _trailsrepository = require("../../../../../test/repositories/trails-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _deletecomment = require("./delete-comment");
let usersRepository;
let projectsRepository;
let trailsRepository;
let commentsRepository;
let author;
let project;
let comment;
let sut;
describe('delete comment use case', ()=>{
    beforeEach(async ()=>{
        usersRepository = new _usersrepository.InMemoryUsersRepository();
        trailsRepository = new _trailsrepository.InMemoryTrailsRepository();
        projectsRepository = new _projectsrepository.InMemoryProjectsRepository();
        commentsRepository = new _commentsrepository.InMemoryCommentsRepository(usersRepository);
        author = await (0, _makeuser.makeUser)();
        const trail = (0, _maketrail.makeTrail)();
        project = (0, _makeproject.makeProject)({
            authorId: author.id,
            trails: new Set([
                trail.id
            ])
        });
        comment = project.comment('Parabéns pelo projeto!', author.id);
        await usersRepository.create(author);
        await trailsRepository.create(trail);
        await projectsRepository.create(project);
        await commentsRepository.create(comment);
        sut = new _deletecomment.DeleteCommentUseCase(commentsRepository, usersRepository);
    });
    it('should be able to delete a comment', async ()=>{
        const response = await sut.execute({
            projectId: project.id.toString(),
            authorId: author.id.toString(),
            commentId: comment.id.toString()
        });
        expect(response.isRight()).toBe(true);
        expect(response.value).toBeUndefined();
    });
    it('should not be able to delete a comment if the author is not logged in', async ()=>{
        const response = await sut.execute({
            projectId: project.id.toString(),
            authorId: '',
            commentId: comment.id.toString()
        });
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBeInstanceOf(_forbiddenerror.ForbiddenError);
    });
    it('should not be able to delete a comment if the author does not exist', async ()=>{
        const response = await sut.execute({
            projectId: project.id.toString(),
            authorId: 'invalid-author-id',
            commentId: comment.id.toString()
        });
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
    it('should not be able to delete a comment if the comment does not exist', async ()=>{
        const response = await sut.execute({
            projectId: project.id.toString(),
            authorId: author.id.toString(),
            commentId: 'invalid-comment-id'
        });
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
    it('should not be able to delete a comment if the project does not exist', async ()=>{
        await projectsRepository.deleteById(project.id.toString());
        const response = await sut.execute({
            projectId: 'invalid-project-id',
            authorId: author.id.toString(),
            commentId: comment.id.toString()
        });
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
});

//# sourceMappingURL=delete-comment.spec.js.map