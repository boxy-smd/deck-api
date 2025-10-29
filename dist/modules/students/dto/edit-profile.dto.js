"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EditProfileDto", {
    enumerable: true,
    get: function() {
        return EditProfileDto;
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
let EditProfileDto = class EditProfileDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Sobre o estudante',
        required: false,
        example: 'Estudante de Engenharia de Software na UFC.'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], EditProfileDto.prototype, "about", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Semestre do estudante',
        required: false,
        example: 6
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], EditProfileDto.prototype, "semester", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'URL do perfil',
        required: false,
        example: 'https://example.com/profile.jpg'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUrl)(),
    _ts_metadata("design:type", String)
], EditProfileDto.prototype, "profileUrl", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'IDs das trilhas',
        required: false,
        type: [
            String
        ],
        example: [
            'uuid-1',
            'uuid-2'
        ]
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    _ts_metadata("design:type", Array)
], EditProfileDto.prototype, "trailsIds", void 0);

//# sourceMappingURL=edit-profile.dto.js.map