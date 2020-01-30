const configExpress = require('./config/express');
const app = configExpress();
const config = require('./config/config');
const socket = require('socket.io');
const nmap = require('libnmap');
var axios = require('axios');

require('./routes/homepage.js')(app);
/*app.route('/vitals')
    .get((req, res, next) => {
        */

var server = app.listen(config.port)
var io = socket(server);

var ping = (target, socket) => 
    axios.get(`http://${target}/api/status`)
        .then((res) => {
            console.log(res.data);
            socket.emit('update', { target, status: res.data.message });
            return;
        })
        .catch((err) => {
            console.log(err.errno)
            socket.emit('error', { error: err.errno });
            return;
        });

var opts = {
    range: ['192.168.254.17/24'],
    ports: '14666'
};

nmap.scan(opts, (err, data) => {
    if (data) {
        var opens = Object.keys(data).reduce((acc, key) => {
            let host = data[key].host;
            if (host) {
                return [
                    ...acc, 
                    ...host.filter((objs) => {
                        //console.log(objs.ports[0].port[0].state[0].item);
                        return (objs.ports[0].port[0].state[0].item.state === 'open');
                    })
                ];
            }
            return acc;
        }, []);

        var infos = {};
        opens.forEach((open) => {
            let address = open.address[0].item.addr;
            let port = open.ports[0].port[0].item.portid;
            infos[`${address}:${port}`] = {
                hostname: open.hostnames[0].hostname[0].item.name,
                address,
                port 
            };
        });
        
        io.sockets
            .on('connection', (socket) => {
                socket.emit('connected', infos);

                socket.on('pinged', (data) => {
                    console.log('pinged!');
                    console.log(data);
                    ping(data.target, socket);
                });

                socket.on('command', (data) => {
                    console.log('received!');
                    console.log(data);
                    axios.post(`http://${data.target}/api/status`, { command: data.command })
                        .then((res) => console.log(res.data))
                        .catch((err) => console.log(err.response.data))
                });
            });

    } else {
        console.log(err);
    };
});


