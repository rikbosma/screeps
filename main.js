var managerMemory = require('manager.memory');
var managerEconomy = require('manager.economy');
var managerBehaviour = require('manager.behaviour');
var managerMilitary = require('manager.military');
var managerOperations = require('manager.operations');


module.exports.loop = function () {
    managerMemory.execute();
    managerEconomy.execute();
    managerBehaviour.execute();
    managerMilitary.execute();
    managerOperations.execute();
}