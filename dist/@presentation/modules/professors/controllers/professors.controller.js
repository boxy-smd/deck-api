"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProfessorsController", {
    enumerable: true,
    get: function() {
        return ProfessorsController;
    }
});
const _makefetchprofessorsusecase = require("../../../../@core/application/factories/professors/make-fetch-professors-use-case");
const _professor = require("../../../presenters/professor");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ProfessorsController = class ProfessorsController {
    async fetchProfessors(query) {
        const fetchProfessorsUseCase = (0, _makefetchprofessorsusecase.makeFetchProfessorsUseCase)();
        const result = await fetchProfessorsUseCase.execute({
            name: query.name
        });
        return {
            professors: result.map(_professor.ProfessorPresenter.toHTTP)
        };
    }
};
_ts_decorate([
    (0, _common.Get)('professors'),
    (0, _swagger.ApiOperation)({
        summary: 'Fetch professors'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Professors retrieved successfully'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FetchProfessorsDto === "undefined" ? Object : FetchProfessorsDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ProfessorsController.prototype, "fetchProfessors", null);
ProfessorsController = _ts_decorate([
    (0, _swagger.ApiTags)('Professors'),
    (0, _common.Controller)()
], ProfessorsController);

//# sourceMappingURL=professors.controller.js.map