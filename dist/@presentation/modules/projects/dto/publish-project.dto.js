"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PublishProjectDto", {
    enumerable: true,
    get: function() {
        return PublishProjectDto;
    }
});
const _swagger = require("@nestjs/swagger");
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
let PublishProjectDto = class PublishProjectDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Título do projeto',
        example: 'Meu Projeto Incrível',
        minLength: 3
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(3, {
        message: 'O título deve ter pelo menos 3 caracteres.'
    }),
    _ts_metadata("design:type", String)
], PublishProjectDto.prototype, "title", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Descrição detalhada',
        example: 'Uma descrição detalhada do meu projeto incrível.'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], PublishProjectDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'URL do banner do projeto',
        required: false,
        example: 'https://example.com/banner.jpg'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUrl)(),
    _ts_metadata("design:type", String)
], PublishProjectDto.prototype, "bannerUrl", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Conteúdo do projeto',
        required: false
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], PublishProjectDto.prototype, "content", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Ano de publicação',
        example: 2024,
        minimum: 2000
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(2000),
    (0, _classvalidator.Max)(new Date().getFullYear()),
    _ts_metadata("design:type", Number)
], PublishProjectDto.prototype, "publishedYear", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Semestre',
        example: 5,
        minimum: 1,
        maximum: 12
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(1, {
        message: 'O semestre deve estar entre 1 e 12.'
    }),
    (0, _classvalidator.Max)(12, {
        message: 'O semestre deve estar entre 1 e 12.'
    }),
    _ts_metadata("design:type", Number)
], PublishProjectDto.prototype, "semester", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Permitir comentários',
        example: true
    }),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], PublishProjectDto.prototype, "allowComments", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'ID da disciplina',
        required: false,
        example: 'uuid'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUUID)(),
    _ts_metadata("design:type", String)
], PublishProjectDto.prototype, "subjectId", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'IDs das trilhas',
        type: [
            String
        ],
        example: [
            'uuid1',
            'uuid2'
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsUUID)('4', {
        each: true,
        message: 'ID da trilha inválido.'
    }),
    _ts_metadata("design:type", Array)
], PublishProjectDto.prototype, "trailsIds", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'IDs dos professores',
        required: false,
        type: [
            String
        ]
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsUUID)('4', {
        each: true,
        message: 'ID do professor inválido.'
    }),
    _ts_metadata("design:type", Array)
], PublishProjectDto.prototype, "professorsIds", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'ID do rascunho',
        required: false,
        example: 'uuid'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUUID)(),
    _ts_metadata("design:type", String)
], PublishProjectDto.prototype, "draftId", void 0);

//# sourceMappingURL=publish-project.dto.js.map