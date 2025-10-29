"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeFetchSubjectsUseCase", {
    enumerable: true,
    get: function() {
        return makeFetchSubjectsUseCase;
    }
});
const _fetchsubjects = require("../../../domain/projects/application/use-cases/fetch-subjects");
const _subjectsrepository = require("../../../infra/database/prisma/repositories/subjects-repository");
function makeFetchSubjectsUseCase() {
    const subjectsRepository = new _subjectsrepository.PrismaSubjectsRepository();
    const fetchSubjectsUseCase = new _fetchsubjects.FetchSubjectsUseCase(subjectsRepository);
    return fetchSubjectsUseCase;
}

//# sourceMappingURL=make-fetch-subjects-use-case.js.map