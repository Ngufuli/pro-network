const express = require('express');
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

module.exports = router;