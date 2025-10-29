"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _swagger = require("@nestjs/swagger");
const _appmodule = require("./app.module");
const _env = require("./infra/config/env/env");
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule, {
        logger: _env.env.NODE_ENV === 'production' ? [
            'error',
            'warn'
        ] : [
            'log',
            'error',
            'warn',
            'debug',
            'verbose'
        ]
    });
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'https://deck-smd.vercel.app'
        ],
        credentials: true
    });
    app.useGlobalPipes(new _common.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
    }));
    const config = new _swagger.DocumentBuilder().setTitle('Deck API').setDescription('Esse é o backend do projeto **Deck**, um projeto de uma aplicação que servirá como repositório de trabalhos realizados por alunos do curso de Sistemas e Mídias Digitais da Universidade Federal do Ceará.').setVersion('1.0.0').setContact('Boxy Team', '', 'boxy@gmail.com').addBearerAuth().addTag('Students', 'Operations related to students').addTag('Professors', 'Operations related to professors').addTag('Subjects', 'Operations related to subjects').addTag('Trails', 'Operations related to trails').addTag('Projects', 'Operations related to projects').addTag('Comments', 'Operations related to comments').addTag('Reports', 'Operations related to reports').build();
    const document = _swagger.SwaggerModule.createDocument(app, config);
    _swagger.SwaggerModule.setup('docs', app, document);
    await app.listen(_env.env.PORT, '0.0.0.0');
    console.log(`🚀 Application is running on: http://localhost:${_env.env.PORT}`);
    console.log(`📚 Docs available at http://localhost:${_env.env.PORT}/docs`);
}
bootstrap();

//# sourceMappingURL=main.js.map