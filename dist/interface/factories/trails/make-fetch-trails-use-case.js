"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeFetchTrailsUseCase", {
    enumerable: true,
    get: function() {
        return makeFetchTrailsUseCase;
    }
});
const _fetchtrails = require("../../../domain/projects/application/use-cases/fetch-trails");
const _trailsrepository = require("../../../infra/database/prisma/repositories/trails-repository");
function makeFetchTrailsUseCase() {
    const trailsRepository = new _trailsrepository.PrismaTrailsRepository();
    const fetchTrailsUseCase = new _fetchtrails.FetchTrailsUseCase(trailsRepository);
    return fetchTrailsUseCase;
}

//# sourceMappingURL=make-fetch-trails-use-case.js.map