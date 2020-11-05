const express = require('express');
const {check, validationResult} = require('express-validator')

const router  = express.Router();

//Route         POST api/users
//Description   Register user
//Access        PUBLIC
router.post('/',[
    check('name', 'Name field is required').not().isEmpty(),
    check('email','Enter a valid email address').isEmail(),
    check('password','Password field should have 6 or more characters').isLength({min: 6})
], (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
    }

    console.log(req.body);
    res.send(`Here is the users page`)
});

module.exports = router;