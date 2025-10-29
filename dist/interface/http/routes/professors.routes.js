"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "professorsRoutes", {
    enumerable: true,
    get: function() {
        return professorsRoutes;
    }
});
const _fetchcontroller = require("../controllers/professors/fetch.controller");
const _fetchschemas = require("../schemas/professors/fetch.schemas");
async function professorsRoutes(app) {
    app.withTypeProvider().get('/professors', {
        schema: _fetchschemas.fetchProfessorsSchemas
    }, _fetchcontroller.fetchProfessors);
}

//# sourceMappingURL=professors.routes.js.map