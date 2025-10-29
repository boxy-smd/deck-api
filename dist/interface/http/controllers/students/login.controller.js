"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "login", {
    enumerable: true,
    get: function() {
        return login;
    }
});
const _makeloginusecase = require("../../../factories/students/make-login-use-case");
async function login(request, reply) {
    const { email, password } = request.body;
    const loginUseCase = (0, _makeloginusecase.makeLoginUseCase)();
    const result = await loginUseCase.execute({
        email,
        password
    });
    if (result.isLeft()) {
        const error = result.value;
        return reply.status(error.statusCode).send({
            message: error.message
        });
    }
    const token = await reply.jwtSign({
        sign: {
            sub: result.value.id
        }
    });
    const refreshToken = await reply.jwtSign({
        sign: {
            sub: result.value.id,
            expiresIn: '7d'
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

//# sourceMappingURL=login.controller.js.map