const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');
// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  // create server and pass schea data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    cotext: authMiddleware
  });
  //start apollo server
  await server.start();
  //integrate apollo with express application
  server.applyMiddleware({ app });
  //log link to test GQL
  console.log(`User GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

startServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
