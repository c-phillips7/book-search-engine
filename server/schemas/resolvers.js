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

};

module.export = resolvers;

module.exports = {
    authMiddleware: function ({ req }) {
        // allows token to be send via req.query
        let token = req.body.token || req.query.token || req.headers.authorizaton;

        if (req.headers.authorizaton) {
            token = token.split(' ').pop().trim();
        }

        if (!token) {
            return req
        }

        // verify token and get user data
        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        }
        catch {
            console.log('Invalid token');
        }
        return req
    },
    signToken: function ({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload }, secret, { expiresIn: expiration})
    },
};


module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via  req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};