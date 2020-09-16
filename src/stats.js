const moment = require('moment')
const prettyBytes = require('pretty-bytes')
const abbreviate = require('number-abbreviate')

function createChart(target, series, label = val => val) {
    var chart = new Chartist.Line(target, {
        series: series
    }, {
        axisX: {
            type: Chartist.FixedScaleAxis,
            divisor: 5,
            labelInterpolationFnc: function(value) {
                return moment(value).format('MMM D');
            }
        },
        axisY: {
            labelInterpolationFnc: label
        }
    });
}

createChart('#users-chart', [
    {
        name: 'users',
        data: users.map(val => ({ x: new Date(val.time), y: val.value }))
    }
])

createChart('#items-chart', [
    {
        name: 'items',
        data: items.map(val => ({ x: new Date(val.time), y: val.value }))
    }
])

createChart('#views-chart', [
    {
        name: 'views',
        data: views.map(val => ({ x: new Date(val.time), y: val.value }))
    }
], val => abbreviate(val))

createChart('#bandwidth-chart', [
    {
        name: 'bandwidth',
        data: bandwidth.map(val => ({ x: new Date(val.time), y: val.value }))
    }
], val => prettyBytes(val))