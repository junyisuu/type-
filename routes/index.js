const express = require('express');
const router = express.Router();

require('./register')(router);
require('./login')(router);
require('./users')(router);
require('./excerpts')(router);
require('./profile')(router);
require('./verify')(router);

module.exports = router;
