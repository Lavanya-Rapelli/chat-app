const client = require('../config/redis.js');

const getCache = async (key) => {
    try {
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('something went wrong', error.message);
        return null;
    }
}

const setCache = async (key, value, ttl) => {
    try {
        await client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

const deleteCache = async (pattern) => {
    try {
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
            await client.del(...keys);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = { getCache, setCache, deleteCache };
