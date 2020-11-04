const express = require('express');

const router  = express.Router();

//Route         GET api/profile
//Description   TEST ROUTE
//Access        PUBLIC
router.get('/', (req, res) => res.send(`Here is the profile page`));

module.exports = router;