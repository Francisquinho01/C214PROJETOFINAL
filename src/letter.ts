const mongoose_i = require('mongoose');
const Schema = mongoose_i.Schema;
//Creating a schema for the Santa Claus letter
const letter = new Schema(
    {
        from: { type: String, default: null },
        to: { type: String, default: null },
        body: { type: String, default: null }
    },
    { timestamps: true } /* With this field, mongoose can handle the fields 'createdAt' and 'updatedAt' */
)

module.exports = mongoose_i.model('cartas', letter);