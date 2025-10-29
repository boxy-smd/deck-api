"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "refresh", {
    enumerable: true,
    get: function() {
        return refresh;
    }
});
async function refresh(request, reply) {
    await request.jwtVerify({
        onlyCookie: true
    });
    const token = await reply.jwtSign({
        sign: {
            sub: request.user.sign.sub
        }
    });
    const refreshToken = await reply.jwtSign({
        sign: {
            sub: request.user.sign.sub
        }
    });
    return reply.setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true
    }).status(200).send({
        token
    });
}

//# sourceMappingURL=refresh.controller.js.map