"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EditProfileUseCase", {
    enumerable: true,
    get: function() {
        return EditProfileUseCase;
    }
});
const _either = require("../../../../shared/either");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
const _semester = require("../../enterprise/value-objects/semester");
let EditProfileUseCase = class EditProfileUseCase {
    async execute({ studentId, about, semester, profileUrl, trailsIds }) {
        const student = await this.usersRepository.findById(studentId);
        if (!student?.profile) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Student not found.'));
        }
        const newSemester = _semester.Semester.create(semester ?? student.profile.semester.value);
        if (newSemester.isLeft()) {
            return (0, _either.left)(newSemester.value);
        }
        student.updateAbout(about ?? student.about);
        student.profile.updateSemester(newSemester.value);
        student.changeProfilePicture(profileUrl ?? student.profileUrl);
        for (const trailId of trailsIds ?? []){
            const trail = await this.trailsRepository.findById(trailId);
            if (!trail) {
                return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError(`Trail with ID ${trailId} not found.`));
            }
            student.addTrailToProfile(trail.id);
        }
        await this.usersRepository.save(student);
        return (0, _either.right)(student);
    }
    constructor(usersRepository, trailsRepository){
        this.usersRepository = usersRepository;
        this.trailsRepository = trailsRepository;
    }
};

//# sourceMappingURL=edit-profile.js.map