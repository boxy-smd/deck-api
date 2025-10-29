"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SubjectsController", {
    enumerable: true,
    get: function() {
        return SubjectsController;
    }
});
const _makefetchsubjectsusecase = require("../../../interface/factories/subjects/make-fetch-subjects-use-case");
const _subject = require("../../../interface/http/presenters/subject");
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
let SubjectsController = class SubjectsController {
    async fetchSubjects(query) {
        const fetchSubjectsUseCase = (0, _makefetchsubjectsusecase.makeFetchSubjectsUseCase)();
        const result = await fetchSubjectsUseCase.execute({
            name: query.name
        });
        return {
            subjects: result.map(_subject.SubjectPresenter.toHTTP)
        };
    }
};
_ts_decorate([
    (0, _common.Get)('subjects'),
    (0, _swagger.ApiOperation)({
        summary: 'Fetch subjects'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Subjects retrieved successfully'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FetchSubjectsDto === "undefined" ? Object : FetchSubjectsDto
    ]),
    _ts_metadata("design:returntype", Promise)
], SubjectsController.prototype, "fetchSubjects", null);
SubjectsController = _ts_decorate([
    (0, _swagger.ApiTags)('Subjects'),
    (0, _common.Controller)()
], SubjectsController);

//# sourceMappingURL=subjects.controller.js.map