'use strict';

const express = require('express');
const controller = require('../tournament/tournament.controller');

const router = express.Router();

router.post('/updatePosition',controller.updatePosition);
router.get('/getTournamentTeamsList',controller.getTournamentTeamsList);

module.exports = router;