"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _maketrail = require("../../../../../test/factories/make-trail");
const _trailsrepository = require("../../../../../test/repositories/trails-repository");
const _fetchtrails = require("./fetch-trails");
let trailsRepository;
let trail;
let sut;
describe('fetch trails use case', ()=>{
    beforeEach(()=>{
        trailsRepository = new _trailsrepository.InMemoryTrailsRepository();
        trail = (0, _maketrail.makeTrail)();
        sut = new _fetchtrails.FetchTrailsUseCase(trailsRepository);
    });
    it('should be able to fetch trails', async ()=>{
        await trailsRepository.create(trail);
        const result = await sut.execute();
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
    });
    it('should be able to fetch trails with empty array', async ()=>{
        const result = await sut.execute();
        expect(result).toEqual([]);
    });
});

//# sourceMappingURL=fetch-trails.spec.js.map