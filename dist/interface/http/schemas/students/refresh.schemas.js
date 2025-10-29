"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "refreshSchemas", {
    enumerable: true,
    get: function() {
        return refreshSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const refreshResponseSchema = _zod.z.object({
    token: _zod.z.string()
}, {
    description: 'Student token refreshed successfully.'
});
const refreshSchemas = {
    summary: 'Refresh token',
    tags: [
        'Students'
    ],
    response: {
        200: refreshResponseSchema,
        400: _commonschemas.zodErrorSchema
    }
};

//# sourceMappingURL=refresh.schemas.js.map