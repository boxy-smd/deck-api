"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _app = require("./app");
const _env = require("./infra/config/env/env");
_app.app.listen({
    host: '0.0.0.0',
    port: _env.env.PORT
}).then(()=>{
    _app.app.log.info(`Docs available at http://localhost:${_env.env.PORT}/docs`);
});

//# sourceMappingURL=server.js.map