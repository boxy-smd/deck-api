"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeFetchProfessorsUseCase", {
    enumerable: true,
    get: function() {
        return makeFetchProfessorsUseCase;
    }
});
const _fetchprofessors = require("../../../domain/projects/application/use-cases/fetch-professors");
const _professorsrepository = require("../../../infra/database/prisma/repositories/professors-repository");
function makeFetchProfessorsUseCase() {
    const professorsRepository = new _professorsrepository.PrismaProfessorsRepository();
    const fetchProfessorsUseCase = new _fetchprofessors.FetchProfessorsUseCase(professorsRepository);
    return fetchProfessorsUseCase;
}

//# sourceMappingURL=make-fetch-professors-use-case.js.map