"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "subjectsRoutes", {
    enumerable: true,
    get: function() {
        return subjectsRoutes;
    }
});
const _fetchcontroller = require("../controllers/subjects/fetch.controller");
const _fetchschemas = require("../schemas/subjects/fetch.schemas");
async function subjectsRoutes(app) {
    app.withTypeProvider().get('/subjects', {
        schema: _fetchschemas.fetchSubjectsSchemas
    }, _fetchcontroller.fetchSubjects);
}

//# sourceMappingURL=subjects.routes.js.map