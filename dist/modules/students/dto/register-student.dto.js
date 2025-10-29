"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RegisterStudentDto", {
    enumerable: true,
    get: function() {
        return RegisterStudentDto;
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
let RegisterStudentDto = class RegisterStudentDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Nome do estudante',
        example: 'João Silva'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], RegisterStudentDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Nome de usuário do estudante',
        example: 'joaosilva',
        minLength: 3
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(3, {
        message: 'Nome de usuário deve ter pelo menos 3 caracteres.'
    }),
    _ts_metadata("design:type", String)
], RegisterStudentDto.prototype, "username", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Email acadêmico do estudante',
        example: 'joao@alu.ufc.br'
    }),
    (0, _classvalidator.IsEmail)({}, {
        message: 'Email inválido.'
    }),
    (0, _classvalidator.Matches)(/@alu\.ufc\.br$/, {
        message: 'Email inválido. Deve ser um email acadêmico.'
    }),
    _ts_metadata("design:type", String)
], RegisterStudentDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Senha do estudante',
        example: 'senha123',
        minLength: 6
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(6, {
        message: 'A senha deve ter pelo menos 6 caracteres.'
    }),
    _ts_metadata("design:type", String)
], RegisterStudentDto.prototype, "password", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Semestre do estudante',
        example: 5,
        minimum: 1,
        maximum: 12
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(1, {
        message: 'Semestre inválido.'
    }),
    (0, _classvalidator.Max)(12, {
        message: 'Semestre inválido.'
    }),
    _ts_metadata("design:type", Number)
], RegisterStudentDto.prototype, "semester", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'IDs das trilhas',
        example: [
            'uuid-1',
            'uuid-2'
        ],
        type: [
            String
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsUUID)('4', {
        each: true,
        message: 'ID de trilha inválido.'
    }),
    _ts_metadata("design:type", Array)
], RegisterStudentDto.prototype, "trailsIds", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Sobre o estudante',
        required: false,
        example: 'Estudante de Engenharia de Software na UFC.'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], RegisterStudentDto.prototype, "about", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'URL do perfil',
        required: false,
        example: 'https://example.com/profile.jpg'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], RegisterStudentDto.prototype, "profileUrl", void 0);

//# sourceMappingURL=register-student.dto.js.map