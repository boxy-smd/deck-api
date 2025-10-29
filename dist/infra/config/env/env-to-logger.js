"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "envToLogger", {
    enumerable: true,
    get: function() {
        return envToLogger;
    }
});
const envToLogger = {
    dev: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname'
            }
        }
    },
    production: true,
    test: false
};

//# sourceMappingURL=env-to-logger.js.map