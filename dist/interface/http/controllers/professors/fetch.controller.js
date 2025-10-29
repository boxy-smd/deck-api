"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fetchProfessors", {
    enumerable: true,
    get: function() {
        return fetchProfessors;
    }
});
const _makefetchprofessorsusecase = require("../../../factories/professors/make-fetch-professors-use-case");
const _professor = require("../../presenters/professor");
async function fetchProfessors(request, reply) {
    const { name } = request.query;
    const fetchProfessorsUseCase = (0, _makefetchprofessorsusecase.makeFetchProfessorsUseCase)();
    const result = await fetchProfessorsUseCase.execute({
        name
    });
    return reply.status(200).send({
        professors: result.map(_professor.ProfessorPresenter.toHTTP)
    });
}

//# sourceMappingURL=fetch.controller.js.map