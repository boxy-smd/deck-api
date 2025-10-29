"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fetchStudents", {
    enumerable: true,
    get: function() {
        return fetchStudents;
    }
});
const _makefetchstudentsusecase = require("../../../factories/students/make-fetch-students-use-case");
const _student = require("../../presenters/student");
async function fetchStudents(request, reply) {
    const { name } = request.query;
    const fetchStudentsUseCase = (0, _makefetchstudentsusecase.makeFetchStudentsUseCase)();
    const result = await fetchStudentsUseCase.execute({
        name
    });
    return reply.status(200).send({
        students: result.map(_student.StudentPresenter.toHTTP)
    });
}

//# sourceMappingURL=fetch.controller.js.map