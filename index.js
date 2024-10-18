const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('../apicontrutora/routes/index'); 

const app = express();
const port = 3000;

app.use(bodyParser.json()); 
app.use('/', userRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
