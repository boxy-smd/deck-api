"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "prisma", {
    enumerable: true,
    get: function() {
        return prisma;
    }
});
const _env = require("../../config/env/env");
const _client = require("@prisma/client");
const prisma = new _client.PrismaClient({
    errorFormat: 'pretty',
    log: _env.env.NODE_ENV === 'dev' ? [
        'query',
        'warn',
        'error'
    ] : []
});

//# sourceMappingURL=client.js.map