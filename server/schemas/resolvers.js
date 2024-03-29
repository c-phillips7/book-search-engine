const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth')
const { User } = require('../models');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({
                    _id: context.user._id
                }).populate(
                    'savedbooks'
                );
                return userData;
            }
            throw new AuthenticationError('not logged in');
        },
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return {
                token,
                user
            };
        },
    },
};

module.export = resolvers;