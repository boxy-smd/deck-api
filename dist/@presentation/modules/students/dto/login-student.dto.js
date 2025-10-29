"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoginStudentDto", {
    enumerable: true,
    get: function() {
        return LoginStudentDto;
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
let LoginStudentDto = class LoginStudentDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Email do estudante',
        example: 'joao@alu.ufc.br'
    }),
    (0, _classvalidator.IsEmail)({}, {
        message: 'Email inválido.'
    }),
    _ts_metadata("design:type", String)
], LoginStudentDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Senha do estudante',
        example: '123456'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(6, {
        message: 'A senha deve ter pelo menos 6 caracteres.'
    }),
    _ts_metadata("design:type", String)
], LoginStudentDto.prototype, "password", void 0);

//# sourceMappingURL=login-student.dto.js.map