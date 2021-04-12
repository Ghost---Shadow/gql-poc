const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            artist(id: Int!): Artist
        }

        type RootMutation {
          createArtist(name: String): Artist
        }

        type Artist {
          name: String
          books: [String!]!
          paintings: [String!]!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      artist: (args) => {
        const { id } = args;
        return {
          name: `Artist ${id}`,
          books: ['Book 1', 'Book 2'],
          paintings: ['Painting 1', 'Painting 2'],
        }
      },
      createArtist: (args) => {
        const { name } = args;
        return {
          name,
          books: ['Book 1', 'Book 2'],
          paintings: ['Painting 1', 'Painting 2'],
        }
      }
    },
    graphiql: true
  })
);

app.listen(3000, () => console.log('Listening: http://localhost:3000/graphql'));
