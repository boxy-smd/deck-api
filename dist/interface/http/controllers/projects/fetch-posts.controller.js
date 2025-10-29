"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fetchPosts", {
    enumerable: true,
    get: function() {
        return fetchPosts;
    }
});
const _makefetchpostsusecase = require("../../../factories/projects/make-fetch-posts-use-case");
const _post = require("../../presenters/post");
async function fetchPosts(_request, reply) {
    const fetchPostsUseCase = (0, _makefetchpostsusecase.makeFetchPostsUseCase)();
    const result = await fetchPostsUseCase.execute();
    reply.status(200).send({
        posts: result.map(_post.PostPresenter.toHTTP)
    });
}

//# sourceMappingURL=fetch-posts.controller.js.map