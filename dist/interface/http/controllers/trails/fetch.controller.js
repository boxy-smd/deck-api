"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fetchTrails", {
    enumerable: true,
    get: function() {
        return fetchTrails;
    }
});
const _makefetchtrailsusecase = require("../../../factories/trails/make-fetch-trails-use-case");
const _trail = require("../../presenters/trail");
async function fetchTrails(_request, reply) {
    const fetchTrailsUseCase = (0, _makefetchtrailsusecase.makeFetchTrailsUseCase)();
    const result = await fetchTrailsUseCase.execute();
    return reply.status(200).send({
        trails: result.map(_trail.TrailPresenter.toHTTP)
    });
}

//# sourceMappingURL=fetch.controller.js.map