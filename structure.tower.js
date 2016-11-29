var taskDefences = require("task.defences");
var taskWork = require("task.work");

module.exports = {
    execute: function () {
        for (roomName in Game.rooms) {
            var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
            towers.forEach(tower => {
                if (tower.energy > 0) {
                    if (!taskDefences.defendRoom(tower)) {
                        if (!taskWork.repairRampart(tower)) {
                            if(!taskWork.repairWall(tower)){
                                taskDefences.healCreep(tower);
                            }
                        }
                    }
                }
            });
         }          

    }

};