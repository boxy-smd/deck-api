"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "projectsRoutes", {
    enumerable: true,
    get: function() {
        return projectsRoutes;
    }
});
const _deletecontroller = require("../controllers/projects/delete.controller");
const _fetchpostscontroller = require("../controllers/projects/fetch-posts.controller");
const _filterpostscontroller = require("../controllers/projects/filter-posts.controller");
const _getcontroller = require("../controllers/projects/get.controller");
const _publishcontroller = require("../controllers/projects/publish.controller");
const _searchpostscontroller = require("../controllers/projects/search-posts.controller");
const _uploadbanner = require("../controllers/projects/upload-banner");
const _verifyjwt = require("../middlewares/verify-jwt");
const _deleteschemas = require("../schemas/projects/delete.schemas");
const _fetchposts = require("../schemas/projects/fetch-posts");
const _filterpostsschemas = require("../schemas/projects/filter-posts.schemas");
const _getschemas = require("../schemas/projects/get.schemas");
const _publishschemas = require("../schemas/projects/publish.schemas");
const _searchpostsschemas = require("../schemas/projects/search-posts.schemas");
const _uploadbannerschemas = require("../schemas/projects/upload-banner.schemas");
async function projectsRoutes(app) {
    app.withTypeProvider().post('/banners/:projectId', {
        preHandler: _verifyjwt.verifyJWT,
        schema: _uploadbannerschemas.uploadBannerSchemas
    }, _uploadbanner.uploadBanner);
    app.withTypeProvider().get('/projects', {
        schema: _fetchposts.fetchPostsSchemas
    }, _fetchpostscontroller.fetchPosts);
    app.withTypeProvider().get('/projects/search', {
        schema: _searchpostsschemas.searchPostsSchemas
    }, _searchpostscontroller.searchPosts);
    app.withTypeProvider().get('/projects/filter', {
        schema: _filterpostsschemas.filterPostsSchemas
    }, _filterpostscontroller.filterPosts);
    app.withTypeProvider().get('/projects/:projectId', {
        schema: _getschemas.getProjectSchemas
    }, _getcontroller.getProject);
    app.withTypeProvider().post('/projects', {
        preHandler: _verifyjwt.verifyJWT,
        schema: _publishschemas.publishProjectSchemas
    }, _publishcontroller.publishProject);
    app.withTypeProvider().delete('/projects/:projectId', {
        preHandler: _verifyjwt.verifyJWT,
        schema: _deleteschemas.deleteProjectSchemas
    }, _deletecontroller.deleteProject);
}

//# sourceMappingURL=projects.routes.js.map