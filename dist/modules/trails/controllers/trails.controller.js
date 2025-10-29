"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TrailsController", {
    enumerable: true,
    get: function() {
        return TrailsController;
    }
});
const _makefetchtrailsusecase = require("../../../interface/factories/trails/make-fetch-trails-use-case");
const _trail = require("../../../interface/http/presenters/trail");
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TrailsController = class TrailsController {
    async fetchTrails() {
        const fetchTrailsUseCase = (0, _makefetchtrailsusecase.makeFetchTrailsUseCase)();
        const result = await fetchTrailsUseCase.execute();
        return {
            trails: result.map(_trail.TrailPresenter.toHTTP)
        };
    }
};
_ts_decorate([
    (0, _common.Get)('trails'),
    (0, _swagger.ApiOperation)({
        summary: 'Fetch trails'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Trails retrieved successfully'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], TrailsController.prototype, "fetchTrails", null);
TrailsController = _ts_decorate([
    (0, _swagger.ApiTags)('Trails'),
    (0, _common.Controller)()
], TrailsController);

//# sourceMappingURL=trails.controller.js.map