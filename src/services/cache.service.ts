import {debug, redisClient} from "../index";

export const getCache = async (key: string) => {
    return JSON.parse(await redisClient.get(key));
}
// callback wrapper for getting cache
export const getCached = async (key: string, callback, options: object) => {
    if (debug) {
        console.info(`getCached(key:${key})`);
        console.info(typeof callback)
    }

    let data = await getCache(key);

    if (!data) {
        if (debug) {
            console.info(`found no data!`);
        }

        if(callback && typeof callback === 'function') {

            if (debug) {
                console.info('getting cached data ...')
                console.info('no cached data ...')
                console.info('getting ready to call callback...')
            }

            data = await callback()

            if (debug) {
                console.info("cached data: ", data)
            }

            await setCache(key, data, options)
            return data;
        }
        return null;
    }
    if (debug) {
        console.info(`found cached data!`);
        console.info(`${key}: `, data);
    }

    return data;
}

export const setCache = async (key: string, data, options: object) => {
    await redisClient.set(key, JSON.stringify(data), options);
}

