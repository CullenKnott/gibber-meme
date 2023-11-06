const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Users {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        friends: [String]
        messages: [Messages]
    }

    type Messages {
        _id: ID!
        text: String!
    }

    type Auth {
        token: ID!
        user: Users
    }
    
    type Query {
        me: Users
    }

    input addFriend {
        _id: ID!
        firstName: String!
        lastName: String!
    }

    input AddMessages {
        text: String!
    }

    type Mutation {
        addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        addMessages(newMessage: AddMessages!): Users
        removeMessage(messageId: ID!): Users

    }
`;

module.exports = typeDefs;

