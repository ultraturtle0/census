var app = require('express')();
const morgan = require('morgan')('dev');
const methodOverride = require('method-override')();
const bodyParser = require('body-parser');
var shell = require('shelljs');

const PORT = 14666;

var codeCheck = (res) =>
    (code, stdout, stderr) =>
        code ?
            res.status(500).send({ errors: ['command failed.', stderr] }) :
            res.send({ message: stdout });

app.use(morgan);
app.use(methodOverride);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.route('/api/status')
    .get((req, res, next) => shell.exec('uptime', codeCheck(res)))
    .post((req, res, next) => {
        if (req.body.command === 'poweroff') { 
            code = shell.exec('/sbin/poweroff').code;
            return res.send({ message: 'success!' });
        } else {
            return res.status(500).send({ errors: ['command failed.'] });
        };
    });


app.listen(PORT);
console.log(`Server running at http://localhost:${PORT}/`);
