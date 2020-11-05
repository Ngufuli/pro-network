const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator')
const auth = require('../../middleware/auth');

const router  = express.Router();

const User = require('../../models/User');

//Route         GET api/auth
//Description   TEST ROUTE
//Access        PUBLIC
router.get('/',auth, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err);
        res.status(500).send('Server error')
    }
});

//Route         POST api/users
//Description   Login user
//Access        PUBLIC
router.post('/',[
    check('email','Enter a valid email address').isEmail(),
    check('password','Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    //destructuring the body to get details
    const { email, password} = req.body;

   try{
        //Check if the user already exists
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({errors:[{msg: 'Invalid credentials'}]});
        } 
        
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({errors:[{msg: 'Invalid credentials'}]});
        }
        
        //Apply JsonWebToken

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload,
            config.get('jwtSecretKey'),
            {expiresIn: 36000},
            (err, token) =>{
                if(err) throw err;
                res.json({token})
            }
        )


        console.log(req.body);
        // res.send(`User saved successfully`)

   }catch(err){
        console.error(err.message);
        res.status(500).send(`Server error`)
   }

 
});

module.exports = router;