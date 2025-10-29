"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "loginSchemas", {
    enumerable: true,
    get: function() {
        return loginSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const loginBodySchema = _zod.z.object({
    email: _zod.z.string({
        description: 'Student email.',
        required_error: 'Email is required.'
    }).email('Invalid email.').regex(/@alu.ufc.br$/, 'Invalid email. Must be an academic email.'),
    password: _zod.z.string({
        description: 'Student password.',
        required_error: 'Password is required.'
    }).min(6, 'Password must have at least 6 characters.')
}, {
    description: 'Student login body.',
    required_error: 'Body is required.',
    invalid_type_error: 'Body must be an object.'
});
const loginResponseSchema = _zod.z.object({
    token: _zod.z.string()
}, {
    description: 'Student logged in successfully.'
});
const loginSchemas = {
    summary: 'Login',
    tags: [
        'Students'
    ],
    body: loginBodySchema,
    response: {
        200: loginResponseSchema,
        400: _commonschemas.zodErrorSchema
    }
};

//# sourceMappingURL=login.schemas.js.map