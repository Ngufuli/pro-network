const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator')

const router  = express.Router();

//Database
const User = require('../../models/User');

//Route         POST api/users
//Description   Register user
//Access        PUBLIC
router.post('/',[
    check('name', 'Name field is required').not().isEmpty(),
    check('email','Enter a valid email address').isEmail(),
    check('password','Password field should have 6 or more characters').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
    }

    //destructuring the body to get details
    const {name, email, password} = req.body;

   try{
        //Check if the user already exists
        let user = await User.findOne({email})
        if(user){
            res.status(400).json({errors:[{msg: 'User already exists'}]});
        } 
        //Add user's gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r:'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        //Encrypt user's password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save()

        //Apply JsonWebToken

        console.log(req.body);
        res.send(`User saved successfully`)

   }catch(err){
        console.error(err.message);
        res.status(500).send(`Server error`)
   }

 
});

module.exports = router;