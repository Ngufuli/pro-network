const express = require('express');

const router  = express.Router();

//Route         GET api/posts
//Description   TEST ROUTE
//Access        PUBLIC
router.get('/', (req, res) => res.send(`Here is the posts page`));

module.exports = router;