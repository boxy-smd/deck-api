"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaProfessorsRepository", {
    enumerable: true,
    get: function() {
        return PrismaProfessorsRepository;
    }
});
const _client = require("../client");
const _prismaprofessormapper = require("../mappers/prisma-professor-mapper");
let PrismaProfessorsRepository = class PrismaProfessorsRepository {
    async findById(id) {
        const professor = await _client.prisma.professor.findUnique({
            where: {
                id
            }
        });
        if (!professor) return null;
        return _prismaprofessormapper.PrismaProfessorMapper.toEntity(professor);
    }
    async findByName(name) {
        const professor = await _client.prisma.professor.findFirst({
            where: {
                name
            }
        });
        if (!professor) return null;
        return _prismaprofessormapper.PrismaProfessorMapper.toEntity(professor);
    }
    async findManyByName(name) {
        const professors = await _client.prisma.professor.findMany({
            where: {
                name: {
                    contains: name
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
        const orderedProfessors = professors.sort((a, b)=>{
            const professorA = a.name.replace('Prof. ', '').replace('Profa. ', '');
            const professorB = b.name.replace('Prof. ', '').replace('Profa. ', '');
            if (professorA < professorB) return -1;
            if (professorA > professorB) return 1;
            return 0;
        });
        return orderedProfessors.map(_prismaprofessormapper.PrismaProfessorMapper.toEntity);
    }
    async findAll() {
        const professors = await _client.prisma.professor.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        const orderedProfessors = professors.sort((a, b)=>{
            const professorA = a.name.replace('Prof. ', '').replace('Profa. ', '');
            const professorB = b.name.replace('Prof. ', '').replace('Profa. ', '');
            if (professorA < professorB) return -1;
            if (professorA > professorB) return 1;
            return 0;
        });
        return orderedProfessors.map(_prismaprofessormapper.PrismaProfessorMapper.toEntity);
    }
    async existsById(id) {
        const count = await _client.prisma.professor.count({
            where: {
                id
            }
        });
        return count > 0;
    }
    async create(professor) {
        const data = _prismaprofessormapper.PrismaProfessorMapper.toPrisma(professor);
        await _client.prisma.professor.create({
            data
        });
    }
    async save(professor) {
        const data = _prismaprofessormapper.PrismaProfessorMapper.toPrisma(professor);
        await _client.prisma.professor.update({
            where: {
                id: professor.id.toString()
            },
            data
        });
    }
    async delete(professor) {
        await _client.prisma.professor.delete({
            where: {
                id: professor.id.toString()
            }
        });
    }
    async deleteById(id) {
        await _client.prisma.professor.delete({
            where: {
                id
            }
        });
    }
};

//# sourceMappingURL=professors-repository.js.map