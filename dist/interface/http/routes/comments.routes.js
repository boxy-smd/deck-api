"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "commentsRoutes", {
    enumerable: true,
    get: function() {
        return commentsRoutes;
    }
});
const _commentonprojectcontroller = require("../controllers/comments/comment-on-project.controller");
const _deletecontroller = require("../controllers/comments/delete.controller");
const _reportcontroller = require("../controllers/comments/report.controller");
const _verifyjwt = require("../middlewares/verify-jwt");
const _commentonprojectschemas = require("../schemas/comments/comment-on-project.schemas");
const _deleteschemas = require("../schemas/comments/delete.schemas");
const _reportschemas = require("../schemas/comments/report.schemas");
async function commentsRoutes(app) {
    app.withTypeProvider().post('/projects/:projectId/comments', {
        preHandler: _verifyjwt.verifyJWT,
        schema: _commentonprojectschemas.commentOnProjectSchemas
    }, _commentonprojectcontroller.commentOnProject);
    app.withTypeProvider().post('/reports/:commentId', {
        preHandler: _verifyjwt.verifyJWT,
        schema: _reportschemas.reportCommentSchemas
    }, _reportcontroller.reportComment);
    app.withTypeProvider().delete('/projects/:projectId/comments/:commentId', {
        preHandler: _verifyjwt.verifyJWT,
        schema: _deleteschemas.deleteCommentSchemas
    }, _deletecontroller.deleteComment);
}

//# sourceMappingURL=comments.routes.js.map