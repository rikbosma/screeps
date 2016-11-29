var rooms = require('memory.rooms');
var creeps = require('memory.creeps');

module.exports = {
    execute: function(){
        rooms.execute();
        creeps.execute();
    }
};