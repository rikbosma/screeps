var enums = require('enums');

module.exports = {
    run: function (creep) {
        var homeRoom = Game.rooms[creep.memory.homeRoom];
        var miningArea = homeRoom.memory.mining.areas[creep.memory.targetRoom];
        if (creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.targetRoom)));
        }
        else {
            creep.moveTo(creep.room.controller);
            if (miningArea.state == enums.miningState.UNEXPLORED) {
                if (creep.room.controller.level == 0) {
                    miningArea.state = enums.miningState.MINABLE;
                }
                else {
                    miningArea.state = enums.miningState.NOT_MINABLE;
                }
            }
            else if (miningArea.sources !== undefined) {
                creep.suicide();
            }
        }
    }
};