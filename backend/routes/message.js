const router = require('express').Router();
const Message = require('../models/message.model');


router.route('/new').post((req, res) => {
    const to = req.body.to;
    const from = req.body.from;
    const body = req.body.bodyM;
    
    const msg = new Message ({
        from,
        to,
        body
    });

    msg.save()
        .then(() => res.json('Message saved!'))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/fetch').post((req, res) => {
    const room = req.body.room;
    Message.find()
        .then(msgs => {
            msgs = msgs.filter(msg => msg.to === room);
            msgs.sort((a, b) => a.updatedAt - b.updatedAt);
            res.json(msgs)
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;
