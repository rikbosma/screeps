var taskResources = require('task.resources');
var taskWork = require('task.work');

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0) {
            creep.memory.unloading = false;
        }
        else if(!creep.memory.unloading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.unloading = true;
        }
        if(creep.memory.unloading){            
            //TODO pick extension by memory
            if(!taskResources.powerSpawn(creep)){
                if(!taskResources.powerExtension(creep)) {
                    if(!taskResources.powerTower(creep)) {
                        var linkSender = Game.getObjectById(creep.room.memory.links["sender"]);
                        if(linkSender === undefined || linkSender === null || linkSender.energy === linkSender.energyCapacity || !taskResources.power(creep, linkSender))
                        {
                            if (!taskWork.repairRampart(creep))
                            {
                                if (!taskWork.repairWall(creep)) {
                                    if (creep.room.storage !== undefined && _.sum(creep.room.storage.store) < creep.room.storage.storeCapacity && !taskResources.storeTarget(creep, creep.room.storage)) {
                                        //creep.moveTo(Game.flags["IdlePosition"]);
                                    }
                                }
                            }
                        }
                    }   
                }      
            }
        }
        else {
            var fullStorage = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) >= structure.storeCapacity * 0.8 && structure.id !== creep.room.memory.containers["controller"] });
            if (fullStorage) {
                taskResources.withdrawTarget(creep, fullStorage);
            }
            else if(creep.room.storage !== undefined){
                var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > structure.storeCapacity * 0.2 && structure.id !== creep.room.memory.containers["controller"] });
                if(storage) {
                    taskResources.withdrawTarget(creep, storage);
                }
                else{
                    taskResources.withdrawTarget(creep, creep.room.storage);
                }
            }
        }
	}
};