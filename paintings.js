const express = require('express');

const app = express();

app.use(express.json());

app.use('/paintings/:id', (req, res) => {
  const { id } = req.params
  console.log(`GET /paintings/${id}`)
  res.json({
    1: ['Painting 1', 'Painting 2', 'Painting 3'],
    2: ['Painting 3', 'Painting 4', 'Painting 5'],
  }[req.params.id] || [])
})

app.listen(3002, () => console.log('Listening: http://localhost:3002/paintings/:id'));
