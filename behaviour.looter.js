var taskResources = require('task.resources');

module.exports = {
    run: function(creep) {
        if(!creep.memory.looting && _.sum(creep.carry) == 0) {
            creep.memory.looting = true;
	    }
	    else if(creep.memory.looting && _.sum(creep.carry) == creep.carryCapacity) {
	        creep.memory.looting = false;
	    }
        if(creep.memory.looting){
            if(!taskResources.loot(creep)){
                if(_.sum(creep.carry) > 0){
                    if(!taskResources.powerSpawn(creep)){
                        taskResources.store(creep);
                    }
                }
                else {
                    var fullStorage = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) >= structure.storeCapacity * 0.8 && structure.id !== creep.room.memory.containers["controller"] });
                    if (fullStorage) {
                        taskResources.withdrawTarget(creep, fullStorage);
                    }
                    else if (creep.room.storage !== undefined) {
                        var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > structure.storeCapacity * 0.2 && structure.id !== creep.room.memory.containers["controller"] });
                        if (storage) {
                            taskResources.withdrawTarget(creep, storage);
                        }
                    }
                }
            }
        }
        else{
            if(creep.room.storage){
                taskResources.storeTarget(creep, creep.room.storage);
            }
            else{
                taskResources.store(creep);
            }
        }
    }
};