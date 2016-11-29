var utilCheck = require("util.check");

module.exports = {
    build: function(creep) {
        return doBuild(creep);
    },
    repairBuilding: function(worker) {
        return doRepairBuilding(worker);
    },
    repairRoad: function (worker) {
        return doRepairRoad(worker);
    },
    repairWall: function (worker) {
        return doRepairWall(worker);
    },
    repairRampart: function(worker){
        return doRepairRampart(worker);
    }
};

function doBuild(creep){
    var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if(target) {
        if(creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            creep.say("to site");
        }
        return true;
    }
    return false;
}

function doRepairBuilding(worker){
    var repairTarget = worker.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(structure) {
            return structure.structureType !== STRUCTURE_ROAD && structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_RAMPART && structure.hits < structure.hitsMax;
        }
    });
    if (repairTarget) {
        if (utilCheck.isCreep(worker)) { worker.say('repair'); }
        if(worker.repair(repairTarget) == ERR_NOT_IN_RANGE) {
            worker.moveTo(repairTarget);
        }
        return true;
    }
    return false;
}

function doRepairRoad(worker){
    var repairTarget = worker.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(structure) {
            return structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax;
        }
    });
    if (repairTarget) {
        if (utilCheck.isCreep(worker)) { worker.say('repair'); }
        if(worker.repair(repairTarget) == ERR_NOT_IN_RANGE) {
            worker.moveTo(repairTarget);
        }
        return true;
    }
    return false;
}

function doRepairWall(worker) {
    var maxWallHits = 30000;
    var repairTarget = worker.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
            return structure.structureType === STRUCTURE_WALL && structure.hits < worker.room.memory.maxHitsDefence;
        }
    });
    if (repairTarget) {
        if (utilCheck.isCreep(worker)) { worker.say('repair'); }
        if (worker.repair(repairTarget) == ERR_NOT_IN_RANGE) {
            worker.moveTo(repairTarget);
        }
        return true;
    }
    return false;
}

function doRepairRampart(worker) {
    var maxHits = 30000;
    var repairTarget = worker.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
            return structure.structureType === STRUCTURE_RAMPART && structure.hits < worker.room.memory.maxHitsDefence;
        }
    });
    if (repairTarget) {
        if (utilCheck.isCreep(worker)) { worker.say('repair'); }
        if (worker.repair(repairTarget) == ERR_NOT_IN_RANGE) {
            worker.moveTo(repairTarget);
        }
        return true;
    }
    return false;
}