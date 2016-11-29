var taskResources = require('task.resources');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }
        if(creep.memory.harvesting) {
            taskResources.harvest(creep);
        }
        else {
            taskResources.store(creep);
        }
	}
};