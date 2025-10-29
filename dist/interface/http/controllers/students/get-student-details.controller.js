"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getStudentDetails", {
    enumerable: true,
    get: function() {
        return getStudentDetails;
    }
});
const _makegetstudentdetailsusecase = require("../../../factories/students/make-get-student-details-use-case");
const _studentprofile = require("../../presenters/student-profile");
async function getStudentDetails(request, reply) {
    const studentId = request.user.sign.sub;
    const getStudentDetailsUseCase = (0, _makegetstudentdetailsusecase.makeGetStudentDetailsUseCase)();
    const result = await getStudentDetailsUseCase.execute({
        studentId
    });
    if (result.isLeft()) {
        const error = result.value;
        return reply.status(error.statusCode).send({
            message: error.message
        });
    }
    return reply.status(200).send({
        details: _studentprofile.StudentProfilePresenter.toHTTP(result.value)
    });
}

//# sourceMappingURL=get-student-details.controller.js.map