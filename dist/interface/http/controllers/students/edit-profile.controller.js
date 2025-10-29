"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "editProfile", {
    enumerable: true,
    get: function() {
        return editProfile;
    }
});
const _makeeditprofileusecase = require("../../../factories/students/make-edit-profile-use-case");
const _studentprofile = require("../../presenters/student-profile");
async function editProfile(request, reply) {
    const { studentId } = request.params;
    if (studentId !== request.user.sign.sub) {
        return reply.status(403).send({
            message: 'Forbidden.'
        });
    }
    const { about, profileUrl, semester, trailsIds } = request.body;
    const editProfileUseCase = (0, _makeeditprofileusecase.makeEditProfileUseCase)();
    const result = await editProfileUseCase.execute({
        studentId,
        profileUrl,
        semester,
        trailsIds,
        about
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

//# sourceMappingURL=edit-profile.controller.js.map