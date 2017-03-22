'use strict';

var fs = require('fs');
var https = require('https');

var url = "https://aerostatica.ru/music/";

var isMissing = false;
var path = "/var/www/html/AerostatAppData/mp3/";

checkMp3(600);

function checkMp3(i) {

    console.log('getMp3Size: ', i.toString() + ".mp3");

    var file_size;

    var options = { method: 'HEAD', host: 'aerostatica.ru', port: 443, path: '/music/' + i.toString() + ".mp3" };
    var req = https.request(options, function (res) {

        console.log('StatusCode: ', res.statusCode);
//        console.log('Headers: ', JSON.stringify(res.headers));

        if (res.headers['content-length']) {
            file_size = parseInt(res.headers['content-length']);
            console.log('file_size(1): ', file_size);
        }

        var file = path + i.toString() + ".mp3";
        console.log('Checking ' + file);

        if (fs.existsSync(file)) {
            console.log('Found ' + file);
            console.log('file_size(2): ', file_size);
            if (file_size) {
                var stats = fs.statSync(file)
                var fileSizeInBytes = stats.size
                console.log('fileSizeInBytes: ', fileSizeInBytes);
                if (fileSizeInBytes < file_size) {
                    setTimeout(getMp3(i), 1000);
                } else {
                    setTimeout(checkMp3(i + 1), 1000);
                }
            } else {
                 setTimeout(checkMp3(i + 1), 1000);
            }
        } else {
            setTimeout(getMp3(i), 1000);
        }

    });
    req.end();
}

function getMp3(i) {

    var file = path + i.toString() + ".mp3";
    var url1 = url + i.toString() + ".mp3";
    console.log('GET: ', url1);

    var request = https.get(url1, function (response) {

        console.log('StatusCode: ', response.statusCode);
        console.log('Headers: ', JSON.stringify(response.headers));

        if (response.statusCode == 200) {
            var file = fs.createWriteStream(path + i.toString() + ".mp3");
            response.pipe(file);
        } else {
            Exit();
        }

        response.on('end', function () {
            setTimeout(checkMp3(i + 1), 3000);
        });

    });
}

function Exit() {
    console.log('Exit');
    process.exit();
}
