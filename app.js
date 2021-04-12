const { default: axios } = require('axios');
const express = require('express');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(express.json());

const BOOK_SERVER = 'http://localhost:3001';
const PAINTING_SERVER = 'http://localhost:3002';

const bookResolver = (id) => async () => {
  const response = await axios.get(`${BOOK_SERVER}/books/${id}`);
  return response.data.map((book) => ({
    name: book,
    artist: artistResolver(id), // eslint-disable-line no-use-before-define
  }));
};

const paintingResolver = (id) => async () => {
  const response = await axios.get(`${PAINTING_SERVER}/paintings/${id}`);
  return response.data.map((painting) => ({
    name: painting,
    artist: artistResolver(id), // eslint-disable-line no-use-before-define
  }));
};

const artistResolver = (id) => async () => ({
  name: `Artist ${id}`,
  books: bookResolver(id),
  paintings: paintingResolver(id),
});

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            artist(id: Int!): Artist
            book(id: Int!): Book
            painting(id: Int!): Painting
        }

        type RootMutation {
          createArtist(name: String): Artist
        }

        type Book {
          name: String!
          artist: Artist
        }

        type Painting {
          name: String!
          artist: Artist
        }

        type Artist {
          name: String!
          books: [Book!]!
          paintings: [Painting!]!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      artist: (args) => {
        const { id } = args;
        const artistObj = artistResolver(id)();
        return artistObj;
      },
      createArtist: (args) => {
        const { name } = args;
        // TODO: POST calls
        const id = 1;
        return {
          name,
          books: bookResolver(id),
          paintings: paintingResolver(id),
        };
      },
    },
    graphiql: true,
  }),
);

app.listen(3000, () => console.log('Listening: http://localhost:3000/graphql'));
