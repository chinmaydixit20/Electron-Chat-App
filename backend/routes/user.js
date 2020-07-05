const router = require('express').Router();
const User = require('../models/user.model');

router.route('/register').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const newUser = new User ({
        username,
        password,
    });

    newUser.save()
        .then(() => res.json('Profile created!'))
        .catch(err => res.status(400).json("Error: " + err));
})

router.route('/login').post((req, res) => {
    User.find()
        .then(users => {
            const u = users.filter(user => {
                return user.username === req.body.username && user.password === req.body.password;
            })
            if(u.length !== 0) {
                return res.json(u);
            }
            else {
                return res.json(null);
            }
        })
})

module.exports = router;    