var spawn = require('structure.spawn');
var link = require('structure.link');

module.exports = {
    execute: function(){
        spawn.execute();
        link.execute();
    }
};