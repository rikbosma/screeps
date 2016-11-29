/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('enums');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    miningState: { UNEXPLORED: 0, NOT_MINABLE: -1, MINABLE: 1, DIGGING: 2, PRODUCTION_FASE_1: 3, PRODUCTION_FASE_2: 4, PRODUCTION_FASE_3: 5 }
};