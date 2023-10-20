const { Schema, model, Types } = require("mongoose");
const bcrypt = require("bcrypt");

const messageSchema = require("./Messages");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address!"],
    },
    password: {
      type: String,
      required: true,
    },
    friends: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        status: Number,
        enums: [
          0, // 'add friend'
          1, // 'requested'
          2, // 'pending'
          3, // 'friends'
        ],
      },
    ],
    messages: [messageSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password for privacy and security
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltrounds = 10;
    this.password = await bcrypt.hash(this.password, saltrounds);
  }

  next();
});

// compare and validate password for log in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("Users", userSchema);

module.exports = User;
