const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
      throw new AuthenticationError(
        "You need to be logged in before you can complete that action"
      );
    },
  },

  Mutation: {
    addUser: async (parent, { firstName, lastName, email, password }) => {
      const user = await User.create({ firstName, lastName, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect email or password");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrecnt email or password");
      }

      const token = signToken(user);

      return { token, user };
    },
    addMessages: async (parent, { newMessage }, context) => {
      console.log("message sent!", newMessage);
      if (context.user) {
        const message = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { messages: newMessage } },
          { new: true }
        );
        return message;
      }
      throw new AuthenticationError(
        "You need to be logged in to perform that action."
      );
    },
    removeMessage: async (parent, { messageId }, context) => {
      if (context.user) {
        const message = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { messages: { messageId } } },
          { new: true }
        );
        return message;
      }
    },
  },
};

module.exports = resolvers;
