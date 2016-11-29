module.exports = {
    isCreep: function (object) {
        return object.name != undefined && Game.creeps[object.name] !== undefined;
    },
    isTower: function (object) {
        return object.structureType === STRUCTURE_TOWER;
    }
};