const { Schema } = require("mongoose");

const messageSchema = new Schema({
  text: {
    type: String,
  },
});

module.exports = messageSchema;
