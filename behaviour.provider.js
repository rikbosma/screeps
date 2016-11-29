var taskResources = require('task.resources');

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
            var controllerContainer = Game.getObjectById(creep.room.memory.containers["controller"]);   
            if(controllerContainer !== undefined && _.sum(controllerContainer.store) == controllerContainer.storeCapacity || !taskResources.storeTarget(creep, controllerContainer)){
                if(creep.room.memory.links !== undefined){
                    var controllerLink = Game.getObjectById(creep.room.memory.links["controller"]);
                    if(controllerLink === undefined && controllerLink === null && controllerLink.energy == controllerLink.energyCapacity || !taskResources.storeTarget(creep, controllerLink)){
                        //creep.moveTo(Game.flags["IdlePosition"]);    
                    }
                }
            }
        }
        else {
            if(creep.room.storage == undefined){
                var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) >= creep.carryCapacity && structure.id !== creep.room.memory.containers["controller"] });
                if (storage) {
                    taskResources.withdrawTarget(creep, storage);
                }
            }
            else if (_.sum(creep.room.storage.store) > creep.carryCapacity) {
                taskResources.withdrawTarget(creep, creep.room.storage);
            }
        }
	}
};