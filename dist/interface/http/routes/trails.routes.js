"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "trailsRoutes", {
    enumerable: true,
    get: function() {
        return trailsRoutes;
    }
});
const _fetchcontroller = require("../controllers/trails/fetch.controller");
const _fetchschemas = require("../schemas/trails/fetch.schemas");
async function trailsRoutes(app) {
    app.withTypeProvider().get('/trails', {
        schema: _fetchschemas.fetchTrailsSchemas
    }, _fetchcontroller.fetchTrails);
}

//# sourceMappingURL=trails.routes.js.map