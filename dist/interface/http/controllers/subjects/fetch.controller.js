"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fetchSubjects", {
    enumerable: true,
    get: function() {
        return fetchSubjects;
    }
});
const _makefetchsubjectsusecase = require("../../../factories/subjects/make-fetch-subjects-use-case");
const _subject = require("../../presenters/subject");
async function fetchSubjects(request, reply) {
    const { name } = request.query;
    const fetchSubjectsUseCase = (0, _makefetchsubjectsusecase.makeFetchSubjectsUseCase)();
    const result = await fetchSubjectsUseCase.execute({
        name
    });
    return reply.status(200).send({
        subjects: result.map(_subject.SubjectPresenter.toHTTP)
    });
}

//# sourceMappingURL=fetch.controller.js.map