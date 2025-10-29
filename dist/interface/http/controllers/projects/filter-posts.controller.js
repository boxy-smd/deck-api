"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "filterPosts", {
    enumerable: true,
    get: function() {
        return filterPosts;
    }
});
const _makefilterpostsbyqueryusecase = require("../../../factories/projects/make-filter-posts-by-query-use-case");
const _post = require("../../presenters/post");
async function filterPosts(request, reply) {
    const { trailsIds, semester, subjectId, publishedYear } = request.query;
    const filterPostsByQueryUseCase = (0, _makefilterpostsbyqueryusecase.makeFilterPostsByQueryUseCase)();
    // Handle comma-separated string or single trail ID
    const trailsArray = trailsIds ? trailsIds.includes(',') ? trailsIds.split(',').map((id)=>id.trim()) : [
        trailsIds
    ] : undefined;
    const result = await filterPostsByQueryUseCase.execute({
        trailsIds: trailsArray,
        semester,
        subjectId,
        publishedYear
    });
    return reply.status(200).send({
        posts: result.map(_post.PostPresenter.toHTTP)
    });
}

//# sourceMappingURL=filter-posts.controller.js.map