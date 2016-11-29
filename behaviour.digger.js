var taskResources = require('task.resources');

module.exports = {
    run: function (creep) {
        if (creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.targetRoom)));
            buildRoad(creep);
        }
        else {
            if (creep.memory.constructing) {
                taskResources.harvest(creep);
                buildRoad(creep);
            }
        }
    }
};

function buildRoad(creep) {
    var objects = creep.room.lookAt(creep.pos);
    console.log(JSON.stringify(objects));
    if (Object.keys(_.filter(objects, [structureType, STRUCTURE_ROAD])).length == 0) {
        creep.say("build road");
        creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
    }
}