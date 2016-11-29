module.exports = {
    getHarvestSpots: function (roomName) {
        var room = Game.rooms[roomName];
        if (room) {
            //Find sources first and save ids
            var sources = room.find(FIND_SOURCES);
            //console.log(JSON.stringify(sources));
            result = [];
            for (var i = 0; i < sources.length; i++) {
                result[i] = { id: sources[i].id, spots: getNumberOfSpots(room, sources[i].pos, 1), harvesters: [] };
            }
            return result;
        }
        return undefined;
    }
};

function getNumberOfSpots(room, pos, radius)
{
    var terrain = room.lookForAtArea(LOOK_TERRAIN,
        pos.y - radius, //top
        pos.x - radius, //left
        pos.y + radius, //bottom
        pos.x + radius, //right
        true);
    var spots = 0;
    for(var i = 0; i < terrain.length; i++)
    {
        if(terrain[i].terrain === 'plain' || terrain[i].terrain === 'swamp')
        {
            spots++;
        }
    }
    return spots;
}

//var room = Game.rooms['W5N8']; var pos = room.find(FIND_SOURCES)[0].pos; var radius = 1; Memory.terrain = room.lookForAtArea(LOOK_TERRAIN, pos.y - radius, pos.x - radius, pos.y + radius, pos.x + radius, true);
//Game.getObjectById(Game.rooms[Object.keys(Memory.rooms)[0]].find(FIND_SOURCES)[0].id);