var taskResources = require('task.resources');
var taskWork = require('task.work');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.room.name !== creep.memory.targetRoom){
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.targetRoom)));
        }
        else{
            if(!creep.memory.harvesting && creep.carry.energy == 0) {
                creep.memory.harvesting = true;
            }
            if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
                creep.memory.harvesting = false;
            }
            if(creep.memory.harvesting) {
                taskResources.harvest(creep);
            }
            else{
                if(!taskResources.powerSpawn(creep)){
                    if(!taskWork.build(creep))
                    {
                        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                            creep.say("to control");
                        }
                        else
                        {
                            creep.say("upgrade");
                        }
                    }
                }
            }
        }
	}
};