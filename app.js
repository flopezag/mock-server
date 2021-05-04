
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.post('/notify', (req, res) => {
    console.log(`==== ${req.method} ${req.url}`);
    console.log('> Headers');
    console.log(req.headers);

    console.log('> Body');
    console.log(req.body);

    res.sendStatus(200);
});

app.listen(10000, "0.0.0.0", () => console.log(`Started server at http://localhost:10000!`));

