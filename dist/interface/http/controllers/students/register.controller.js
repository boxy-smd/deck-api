"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "register", {
    enumerable: true,
    get: function() {
        return register;
    }
});
const _makeregisterusecase = require("../../../factories/students/make-register-use-case");
async function register(request, reply) {
    const { name, username, email, password, semester, about, profileUrl, trailsIds } = request.body;
    const registerUseCase = (0, _makeregisterusecase.makeRegisterUseCase)();
    const result = await registerUseCase.execute({
        name,
        username,
        email,
        password,
        semester,
        about,
        profileUrl,
        trailsIds
    });
    if (result.isLeft()) {
        const error = result.value;
        return reply.status(error.statusCode).send({
            message: error.message
        });
    }
    return reply.status(201).send({
        user_id: result.value.id.toString()
    });
}

//# sourceMappingURL=register.controller.js.map