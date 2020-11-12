const redis = require("redis");
const { promisify } = require("util");
const ua = require('universal-analytics');

const client = redis.createClient();

const blpopAsync = promisify(client.blpop).bind(client);

client.on("error", function (error) {
    console.error(error);
});

async function getItem() {
    const item = await blpopAsync('hits', 10)
    if (item !== null) {
        const visitor = ua('UA-121951630-1').pageview(item).send()
    }
    getItem()

}

getItem()