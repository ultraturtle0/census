const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

module.exports = () => {
    const app = express();
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(express.static('public'));

    app.set('views', './views');
    app.set('view engine', 'ejs');

    return app;
};
    
