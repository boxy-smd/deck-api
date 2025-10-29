"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "searchPosts", {
    enumerable: true,
    get: function() {
        return searchPosts;
    }
});
const _makesearchpostsbyprofessornameusecase = require("../../../factories/projects/make-search-posts-by-professor-name-use-case");
const _makesearchpostsbytagusecase = require("../../../factories/projects/make-search-posts-by-tag-use-case");
const _makesearchpostsbytitleusecase = require("../../../factories/projects/make-search-posts-by-title-use-case");
const _post = require("../../presenters/post");
async function searchPosts(request, reply) {
    const { professorName, tag, title } = request.query;
    let posts = [];
    if (professorName) {
        const searchPostsByProfessorNameUseCase = (0, _makesearchpostsbyprofessornameusecase.makeSearchPostsByProfessorNameUseCase)();
        posts = await searchPostsByProfessorNameUseCase.execute({
            name: professorName
        });
    }
    if (tag) {
        const searchPostsByTagUseCase = (0, _makesearchpostsbytagusecase.makeSearchPostsByTagUseCase)();
        posts = await searchPostsByTagUseCase.execute({
            tag
        });
    }
    if (title) {
        const searchPostsByTitleUseCase = (0, _makesearchpostsbytitleusecase.makeSearchPostsByTitleUseCase)();
        posts = await searchPostsByTitleUseCase.execute({
            title
        });
    }
    return reply.status(200).send({
        posts: posts.map(_post.PostPresenter.toHTTP)
    });
}

//# sourceMappingURL=search-posts.controller.js.map