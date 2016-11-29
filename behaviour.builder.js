var taskResources = require('task.resources');
var taskWork = require('task.work');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }


	    if(creep.memory.building) {
            if(!taskWork.build(creep))
            {
                if(!taskWork.repairBuilding(creep)){
                    if(!taskWork.repairRoad(creep)){
                        if(!taskWork.repairRampart(creep)){
                            creep.say("idle");
                            //creep.moveTo(Game.flags["IdlePosition"]);
                        }
                    }
                }
            }
	    }
	    else {
            taskResources.withdraw(creep);
	    }
	}
};