var taskResources = require('task.resources');

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.unloading && creep.carry.energy == 0) {
            creep.memory.unloading = false;
        }
        else if(!creep.memory.unloading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.unloading = true;
        }
        if(creep.memory.unloading){            
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
                creep.say("to control");
            }
        }
        else {
            var container = Game.getObjectById(creep.room.memory.containers["controller"]);
            if(container === undefined || container === null || _.sum(container.store) < creep.carryCapacity || !taskResources.withdrawTarget(creep, container)){
                var link = Game.getObjectById(creep.room.memory.links["controller"]);
                if(link === null || link === undefined || (link.energy < creep.carryCapacity || !taskResources.withdrawTarget(creep, link))){
                    taskResources.withdraw(creep);
                }
            }
        }
	}
};