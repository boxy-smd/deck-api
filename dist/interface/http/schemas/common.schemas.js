"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get errorResponseSchema () {
        return errorResponseSchema;
    },
    get zodErrorSchema () {
        return zodErrorSchema;
    }
});
const _zod = require("zod");
const zodErrorSchema = _zod.z.object({
    message: _zod.z.string({
        description: 'Zod error message.'
    }),
    errors: _zod.z.object({
        fields: _zod.z.record(_zod.z.array(_zod.z.string())),
        form: _zod.z.array(_zod.z.string())
    }, {
        description: 'Zod error fields and form.'
    }).optional()
}, {
    description: 'Zod error response.'
});
const errorResponseSchema = _zod.z.object({
    message: _zod.z.string({
        description: 'Error message.'
    })
}, {
    description: 'Error response.'
});

//# sourceMappingURL=common.schemas.js.map