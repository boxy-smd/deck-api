"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HealthController", {
    enumerable: true,
    get: function() {
        return HealthController;
    }
});
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
let HealthController = class HealthController {
    healthCheck() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString()
        };
    }
};
_ts_decorate([
    (0, _common.Get)('health-check'),
    (0, _swagger.ApiOperation)({
        summary: 'Health check'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'API is healthy'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], HealthController.prototype, "healthCheck", null);
HealthController = _ts_decorate([
    (0, _swagger.ApiTags)('Health'),
    (0, _common.Controller)()
], HealthController);

//# sourceMappingURL=health.controller.js.map