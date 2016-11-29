module.exports = {
    harvest: function(creep) {
        doHarvest(creep);
    },
    withdraw: function(creep) {
        return doWithdraw(creep);
    },
    withdrawTarget: function(creep, source){
        return doWithdrawTarget(creep, source);
    },
    power: function(creep, target){
        return doPower(creep, target);
    },
    powerSpawn: function(creep) {
        return doPowerSpawn(creep);
    },
    powerExtension: function(creep) {
        return doPowerExtension(creep);
    },
    powerTower: function(creep) {
        return doPowerTower(creep);
    },
    store: function(creep) {
        return doStore(creep);
    },
    storeTarget: function(creep, target){
        return doStoreTarget(creep, target);
    },
    loot: function(creep){
        return doLoot(creep);
    }
};


function doWithdraw(creep) {
    var storeTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store) >= creep.carryCapacity && structure.id !== creep.room.memory.containers["controller"];
        }
    });
    if (storeTarget) {
        if (creep.withdraw(storeTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(storeTarget);
            creep.say("to storage")
            return true;
        }
        else {
            creep.say('withdraw');
        }
    }
    else {
        doHarvest(creep);
    }

}

function doWithdrawTarget(creep, target) {
    if (target) {
        if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            creep.say("to storage")
        }
        else {
            creep.say('withdraw');
        }
        return true;
    }
    else {
        return false;
    }

}

function doHarvest(creep) {
    var source = Game.getObjectById(creep.memory.source);
    if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
        creep.say("to source");
    }
    else {
        creep.say("harvest");
    }
    return true;
}

function doPower(creep, target){
    if(target)
    {
        if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        return true;
    }
    return false;
}

function doPowerSpawn(creep){
    var spawns = creep.room.find(FIND_MY_SPAWNS, {
        filter: (spawn) => {
            return spawn.energy < spawn.energyCapacity; 
        }
    });
    if(spawns.length > 0)
    {
        if(creep.transfer(spawns[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawns[0]);
            creep.say("pwr spawn");
            return true;
        }
    }
    return false;
}

function doPowerExtension(creep){
    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity;    
        }
    });
    if(target) {
        if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            creep.say("pwr ext");
            return true;
        }
    }
    return false;
}

function doStore(creep)
{
    var storeTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (structure) => {
        return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN ) && structure.energy < structure.energyCapacity) ||
            ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store) < structure.storeCapacity)
    }});
    if(storeTarget) {
        if(creep.transfer(storeTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(storeTarget);
            creep.say("store");
            return true;
        }
    }
    return false;
}

function doStoreTarget(creep, storeTarget) {
    if (storeTarget) {
        if (creep.transfer(storeTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(storeTarget);
            creep.say("store");
            return true;
        }
    }
    else {
        creep.say("no str tar");
        return false;
    }
}

function doLoot(creep) {
    var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
    if(target)
    {
        if(creep.pickup(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            creep.say("to loot");
        }
        else
        {
            creep.say("Loot");
        }
        return true;
    }
    return false;
}

function doPowerTower(creep) {
    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity * 0.8;
        }});
    if(target)
    {
        if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            creep.say("pwr tower");
        }
        return true;
    }
    return false;
}