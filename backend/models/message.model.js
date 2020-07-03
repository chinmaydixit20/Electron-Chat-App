const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema ({
    from: {type: String, required:true},
    to: {type: String, required: true},
    body: {type: String}
}, {
    timestamps: true,
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;