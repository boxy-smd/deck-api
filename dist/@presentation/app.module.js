"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _prismamodule = require("../@infra/database/prisma/prisma.module");
const _healthcontroller = require("../@shared/kernel/controllers/health.controller");
const _authmodule = require("./modules/auth/auth.module");
const _commentsmodule = require("./modules/comments/comments.module");
const _professorsmodule = require("./modules/professors/professors.module");
const _projectsmodule = require("./modules/projects/projects.module");
const _studentsmodule = require("./modules/students/students.module");
const _subjectsmodule = require("./modules/subjects/subjects.module");
const _trailsmodule = require("./modules/trails/trails.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot({
                isGlobal: true
            }),
            _prismamodule.PrismaModule,
            _authmodule.AuthModule,
            _studentsmodule.StudentsModule,
            _professorsmodule.ProfessorsModule,
            _subjectsmodule.SubjectsModule,
            _trailsmodule.TrailsModule,
            _projectsmodule.ProjectsModule,
            _commentsmodule.CommentsModule
        ],
        controllers: [
            _healthcontroller.HealthController
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map