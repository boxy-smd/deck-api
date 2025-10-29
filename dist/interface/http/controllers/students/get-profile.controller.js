"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getProfile", {
    enumerable: true,
    get: function() {
        return getProfile;
    }
});
const _makegetprofileusecase = require("../../../factories/students/make-get-profile-use-case");
const _studentprofile = require("../../presenters/student-profile");
async function getProfile(request, reply) {
    const { username } = request.params;
    const getProfileUseCase = (0, _makegetprofileusecase.makeGetProfileUseCase)();
    const result = await getProfileUseCase.execute({
        username
    });
    if (result.isLeft()) {
        const error = result.value;
        return reply.status(error.statusCode).send({
            message: error.message
        });
    }
    return reply.status(200).send({
        profile: _studentprofile.StudentProfilePresenter.toHTTP(result.value)
    });
}

//# sourceMappingURL=get-profile.controller.js.map