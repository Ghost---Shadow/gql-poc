const express = require('express');

const app = express();

app.use(express.json());

app.use('/books/:id', (req, res) => {
  const { id } = req.params
  console.log(`GET /books/${id}`)
  res.json({
    1: ['Book 1', 'Book 2', 'Book 3'],
    2: ['Book 3', 'Book 4', 'Book 5'],
  }[id] || [])
})

app.listen(3001, () => console.log('Listening: http://localhost:3001/books/:id'));
