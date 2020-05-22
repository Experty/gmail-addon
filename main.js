const express = require('express');
const app = express();

const PUBLIC_DIR = [__dirname, 'public'].join`/`;
const PORT = process.env.PORT || 3000;
 
app.use(express.static(PUBLIC_DIR));
 
app.listen(PORT);
