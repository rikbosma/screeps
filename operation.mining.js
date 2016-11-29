module.exports = {
    execute: function () {
        for (roomName in Game.rooms) {
            var room = Game.rooms[roomName];
            if (room.controller.my && room.controller.level >= 5) {
                //Start operation
                //[x] We need to determine whether there are neighbor rooms (in memory.rooms)
                //[ ] We need an explorer to observe the room to determine whether we can mine the area
                //[x] We need to detect the energy sources (in memory.rooms) 
                //[ ] We need to determine the most optimal exits (in order but make sure they are all there)
                //[ ] We need to determine closest source to our exit 
                //[ ] We need to build the mine shaft and containers next to the source
                //[ ] We need to send miners in
                //[ ] We need transporters to bring the energy to our bases storage
                //[ ] We need to send in a guard to keep the room safe/or not because probably getting all the miners killed is cheaper..
            }
        }
    }
};