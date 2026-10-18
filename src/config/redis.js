const  { createClient } = require( 'redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'mice-turboclean-mercurial-24719.db.redis.io',
        port: 11880
    }
});

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  

module.exports = redisClient;