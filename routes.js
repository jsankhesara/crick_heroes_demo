/**
 * Main application routes
 */

'use strict';

module.exports = function (app) {
    app.use('/api/tournament', require('./controllers/tournament'));
};