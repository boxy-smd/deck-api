"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _makesubject = require("../../../../../test/factories/make-subject");
const _subjectsrepository = require("../../../../../test/repositories/subjects-repository");
const _fetchsubjects = require("./fetch-subjects");
let subjectsRepository;
let subject;
let sut;
describe('fetch subjects use case', ()=>{
    beforeEach(()=>{
        subjectsRepository = new _subjectsrepository.InMemorySubjectsRepository();
        subject = (0, _makesubject.makeSubject)();
        sut = new _fetchsubjects.FetchSubjectsUseCase(subjectsRepository);
    });
    it('should be able to fetch subjects', async ()=>{
        await subjectsRepository.create(subject);
        const result = await sut.execute({});
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
    });
    it('should be able to fetch subjects with name', async ()=>{
        await subjectsRepository.create(subject);
        const result = await sut.execute({
            name: subject.name
        });
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
    });
    it('should be able to fetch subjects with empty array', async ()=>{
        const result = await sut.execute({});
        expect(result).toEqual([]);
    });
});

//# sourceMappingURL=fetch-subjects.spec.js.map