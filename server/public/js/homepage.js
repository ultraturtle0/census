var target_to_id = (target) => target.replace(/\./g, '-').replace(/\:/g, '_');


$(document).ready(() => {
    var socket = io('http://localhost:14777');


    socket.on('error', function (data) {
        console.log(data);
    });

    socket.on('update', function (data) {
        if ('status' in data)
            $(`#status${target_to_id(data.target)}`).text(data.status);
    });


    socket.on('connected', function (data) {
        console.log(data);
        Object.keys(data).forEach((key, index) => {
            let device = data[key];
            $('#pi1').append(`
                <tr>
                    <td>${device.hostname}</td>
                    <td>${device.address}:${device.port}</td>
                    <td id="status${target_to_id(key)}"></td>
                    <td><button id="poweroff${index}">poweroff</button></td>
                </tr>`);

                $(`#poweroff${index}`).click(function (e) {
                    e.preventDefault();
                    socket.emit('command', { target: `${device.address}:${device.port}`, command: 'poweroff' });
                });

                socket.emit('pinged', { target: key });
        });
        
    });

})

