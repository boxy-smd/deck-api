"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "app", {
    enumerable: true,
    get: function() {
        return app;
    }
});
const _cookie = /*#__PURE__*/ _interop_require_default(require("@fastify/cookie"));
const _cors = /*#__PURE__*/ _interop_require_default(require("@fastify/cors"));
const _jwt = /*#__PURE__*/ _interop_require_default(require("@fastify/jwt"));
const _multipart = /*#__PURE__*/ _interop_require_default(require("@fastify/multipart"));
const _swagger = /*#__PURE__*/ _interop_require_default(require("@fastify/swagger"));
const _fastifyapireference = /*#__PURE__*/ _interop_require_default(require("@scalar/fastify-api-reference"));
const _fastify = require("fastify");
const _fastifytypeproviderzod = require("fastify-type-provider-zod");
const _envtologger = require("./infra/config/env/env-to-logger");
const _env = require("./infra/config/env/env");
const _errorhandler = require("./interface/error-handler");
const _studentsroutes = require("./interface/http/routes/students.routes");
const _commentsroutes = require("./interface/http/routes/comments.routes");
const _professorsroutes = require("./interface/http/routes/professors.routes");
const _projectsroutes = require("./interface/http/routes/projects.routes");
const _subjectsroutes = require("./interface/http/routes/subjects.routes");
const _trailsroutes = require("./interface/http/routes/trails.routes");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function buildServer() {
    const app = (0, _fastify.fastify)({
        logger: _envtologger.envToLogger[_env.env.NODE_ENV]
    });
    app.register(_cors.default, {
        origin: [
            'http://localhost:3000',
            'https://deck-smd.vercel.app'
        ],
        credentials: true
    });
    app.register(_jwt.default, {
        cookie: {
            cookieName: 'refreshToken',
            signed: false
        },
        secret: _env.env.JWT_SECRET
    });
    app.register(_cookie.default, {
        secret: _env.env.JWT_SECRET
    });
    app.register(_multipart.default, {
        limits: {
            files: 1,
            fileSize: 5 * 1024 * 1024
        }
    });
    app.setValidatorCompiler(_fastifytypeproviderzod.validatorCompiler);
    app.setSerializerCompiler(_fastifytypeproviderzod.serializerCompiler);
    app.register(_swagger.default, {
        swagger: {
            consumes: [
                'application/json'
            ],
            produces: [
                'application/json'
            ],
            info: {
                title: 'Deck API',
                contact: {
                    name: 'Boxy Team',
                    email: 'boxy@gmail.com'
                },
                description: 'Esse é o backend do projeto **Deck**, um projeto de uma aplicação que servirá como repositório de trabalhos realizados por alunos do curso de Sistemas e Mídias Digitais da Universidade Federal do Ceará.',
                version: '1.0.0'
            },
            tags: [
                {
                    name: 'Students',
                    description: 'Operations related to students'
                },
                {
                    name: 'Professors',
                    description: 'Operations related to professors'
                },
                {
                    name: 'Subjects',
                    description: 'Operations related to subjects'
                },
                {
                    name: 'Trails',
                    description: 'Operations related to trails'
                },
                {
                    name: 'Projects',
                    description: 'Operations related to projects'
                },
                {
                    name: 'Comments',
                    description: 'Operations related to comments'
                },
                {
                    name: 'Reports',
                    description: 'Operations related to reports'
                }
            ]
        },
        transform: _fastifytypeproviderzod.jsonSchemaTransform
    });
    app.register(_fastifyapireference.default, {
        routePrefix: '/docs',
        configuration: {
            title: 'Deck API',
            spec: {
                content: ()=>app.swagger()
            },
            theme: 'purple',
            metaData: {
                title: 'Deck API Reference',
                description: 'API Reference for Deck API'
            }
        }
    });
    app.register(_studentsroutes.studentsRoutes);
    app.register(_subjectsroutes.subjectsRoutes);
    app.register(_professorsroutes.professorsRoutes);
    app.register(_trailsroutes.trailsRoutes);
    app.register(_projectsroutes.projectsRoutes);
    app.register(_commentsroutes.commentsRoutes);
    app.get('/health-check', ()=>{
        return {
            status: 'ok'
        };
    });
    app.get('/swagger.json', ()=>{
        return app.swagger();
    });
    app.setErrorHandler(_errorhandler.errorHandler);
    return app;
}
const app = await buildServer();

//# sourceMappingURL=app.js.map