"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "verifyJWT", {
    enumerable: true,
    get: function() {
        return verifyJWT;
    }
});
async function verifyJWT(request, reply) {
    try {
        await request.jwtVerify();
    } catch (_) {
        reply.status(401).send({
            message: 'Unauthorized.'
        });
    }
}

//# sourceMappingURL=verify-jwt.js.map