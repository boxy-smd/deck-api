"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthModule", {
    enumerable: true,
    get: function() {
        return AuthModule;
    }
});
const _env = require("../../infra/config/env/env");
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _passport = require("@nestjs/passport");
const _jwtstrategy = require("./strategies/jwt.strategy");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AuthModule = class AuthModule {
};
AuthModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _passport.PassportModule,
            _jwt.JwtModule.register({
                secret: _env.env.JWT_SECRET,
                signOptions: {
                    expiresIn: '7d'
                }
            })
        ],
        providers: [
            _jwtstrategy.JwtStrategy
        ],
        exports: [
            _jwt.JwtModule
        ]
    })
], AuthModule);

//# sourceMappingURL=auth.module.js.map