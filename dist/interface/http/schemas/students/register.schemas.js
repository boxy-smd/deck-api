"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "registerSchemas", {
    enumerable: true,
    get: function() {
        return registerSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const registerBodySchema = _zod.z.object({
    name: _zod.z.string({
        description: 'Student name.',
        required_error: 'Name is required.'
    }),
    username: _zod.z.string({
        description: 'Student username.',
        required_error: 'Username is required.'
    }).min(3, 'Username must have at least 3 characters.'),
    email: _zod.z.string({
        description: 'Student email.',
        required_error: 'Email is required.'
    }).email('Invalid email.').regex(/@alu.ufc.br$/, 'Invalid email. Must be an academic email.'),
    password: _zod.z.string({
        description: 'Student password.',
        required_error: 'Password is required.'
    }).min(6, 'Password must have at least 6 characters.'),
    semester: _zod.z.number({
        description: 'Student semester.',
        required_error: 'Semester is required.'
    }).int().min(1, 'Invalid semester.').max(12, 'Invalid semester.'),
    trailsIds: _zod.z.array(_zod.z.string({
        description: 'Trail id.'
    }).uuid('Invalid trail id.'), {
        description: 'Trails ids.',
        required_error: 'Trails ids is required.'
    }),
    about: _zod.z.string({
        description: 'Student about.'
    }).optional(),
    profileUrl: _zod.z.string({
        description: 'Student profile url.'
    }).optional()
}, {
    description: 'Student register body.',
    required_error: 'Body is required.',
    invalid_type_error: 'Body must be an object.'
});
const registerResponseSchema = _zod.z.object({
    user_id: _zod.z.string()
}, {
    description: 'Student registered successfully.'
});
const registerSchemas = {
    summary: 'Register',
    tags: [
        'Students'
    ],
    body: registerBodySchema,
    response: {
        201: registerResponseSchema,
        400: _commonschemas.zodErrorSchema,
        404: _commonschemas.errorResponseSchema,
        409: _commonschemas.errorResponseSchema
    }
};

//# sourceMappingURL=register.schemas.js.map