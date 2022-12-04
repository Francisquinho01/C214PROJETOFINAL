const mongoose_i = require('mongoose');
const Schema = mongoose_i.Schema;

const letter = new Schema(
    {
        from: { type: String, default: null },
        to: { type: String, default: null },
        body: { type: String, default: null }
    },
    { timestamps: true } 
)

module.exports = mongoose_i.model('cartas', letter);