const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());

app.engine('html', exphbs({ extname: 'html' }));
app.set('view engine', 'html');

app.set('views', path.join(__dirname, 'views'));

const { Pool } = require('pg');
const pgPool = new Pool({
    user: 'your_user',
    host: 'your_host',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

const searchRouter = express.Router();
const searchRoutes = require('./routes/search');
app.use('/search', searchRoutes(searchRouter, pgPool));

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

