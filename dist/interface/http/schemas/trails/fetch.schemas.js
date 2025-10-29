"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fetchTrailsSchemas", {
    enumerable: true,
    get: function() {
        return fetchTrailsSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const fetchTrailsResponseSchema = _zod.z.object({
    trails: _zod.z.array(_zod.z.object({
        id: _zod.z.string(),
        name: _zod.z.string()
    }))
}, {
    description: 'Trails fetched.'
});
const fetchTrailsSchemas = {
    summary: 'Fetch trails',
    tags: [
        'Trails'
    ],
    response: {
        200: fetchTrailsResponseSchema,
        400: _commonschemas.zodErrorSchema
    }
};

//# sourceMappingURL=fetch.schemas.js.map