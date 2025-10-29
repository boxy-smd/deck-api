"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _makeprofessor = require("../../../../../test/factories/make-professor");
const _professorsrepository = require("../../../../../test/repositories/professors-repository");
const _fetchprofessors = require("./fetch-professors");
let professorsRepository;
let professor;
let sut;
describe('fetch professors use case', ()=>{
    beforeEach(()=>{
        professorsRepository = new _professorsrepository.InMemoryProfessorsRepository();
        professor = (0, _makeprofessor.makeProfessor)();
        sut = new _fetchprofessors.FetchProfessorsUseCase(professorsRepository);
    });
    it('should be able to fetch professors', async ()=>{
        await professorsRepository.create(professor);
        const result = await sut.execute({});
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
    });
    it('should be able to fetch professors with name', async ()=>{
        const otherProfessor = (0, _makeprofessor.makeProfessor)({
            name: 'Other Professor'
        });
        await professorsRepository.create(otherProfessor);
        await professorsRepository.create(professor);
        const result = await sut.execute({
            name: professor.name
        });
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
        expect(result[0].name).toEqual(professor.name);
    });
    it('should be able to fetch professors with empty array', async ()=>{
        const result = await sut.execute({});
        expect(result).toEqual([]);
    });
});

//# sourceMappingURL=fetch-professors.spec.js.map