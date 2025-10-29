"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get FetchPostsDto () {
        return FetchPostsDto;
    },
    get FilterPostsDto () {
        return FilterPostsDto;
    }
});
const _swagger = require("@nestjs/swagger");
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FetchPostsDto = class FetchPostsDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Filtro de busca geral',
        required: false,
        example: 'web'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FetchPostsDto.prototype, "query", void 0);
let FilterPostsDto = class FilterPostsDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Filtro por ID da disciplina',
        required: false,
        example: 'uuid'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FilterPostsDto.prototype, "subjectId", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Filtro por IDs das trilhas',
        required: false,
        type: [
            String
        ],
        example: [
            'uuid1',
            'uuid2'
        ]
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    _ts_metadata("design:type", Array)
], FilterPostsDto.prototype, "trailsIds", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Filtro por nome do professor',
        required: false,
        example: 'Maria'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FilterPostsDto.prototype, "professorName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Filtro por tags',
        required: false,
        type: [
            String
        ],
        example: [
            'react',
            'typescript'
        ]
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    _ts_metadata("design:type", Array)
], FilterPostsDto.prototype, "tags", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Pesquisa por título do post',
        required: false,
        example: 'website'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FilterPostsDto.prototype, "title", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Filtro por semestre',
        required: false,
        example: 1
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classtransformer.Type)(()=>Number),
    (0, _classvalidator.IsInt)(),
    _ts_metadata("design:type", Number)
], FilterPostsDto.prototype, "semester", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Filtro por ano de publicação',
        required: false,
        example: 2024
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classtransformer.Type)(()=>Number),
    (0, _classvalidator.IsInt)(),
    _ts_metadata("design:type", Number)
], FilterPostsDto.prototype, "publishedYear", void 0);

//# sourceMappingURL=fetch-posts.dto.js.map