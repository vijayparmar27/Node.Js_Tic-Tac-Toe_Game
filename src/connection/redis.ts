import { createClient, RedisClientType } from 'redis';
import logger from '../logger';
import Config from "../config/config";
import Redis from '../main/redis';

class RedisConnection {

    private redisClients: any;
    private redisPubClients: any;
    private redisSubClients: any;

    constructor() {
    }

    redisConnect() {
        return new Promise(async (resolve, reject) => {

            const { REDIS_DB, RDS_HOST, RDS_AUTH, REDIS_PORT } = Config;

            let counter = 0;

            const redisConfig: {
                socket: {
                    host: string,
                    port: number
                },
                database: number,
                password?: string
            } = {
                socket: {
                    host: RDS_HOST,
                    port: REDIS_PORT,
                },
                database: REDIS_DB,
            };

            if (RDS_AUTH !== "") {
                redisConfig.password = RDS_AUTH;
            }

            logger.info('---- RedisConnection :: redisConfig :: ', redisConfig);

            this.redisClients = createClient(redisConfig);
            this.redisPubClients = createClient(redisConfig);

            this.redisSubClients = this.redisPubClients.duplicate()

            async function check(this: any) {
                if (counter === 2) {
                    Redis.init(this.redisClients)
                    const flushDB = await this.redisClients.flushDb();
                    logger.info('redis data :: flushDb ::', flushDB);

                    resolve("")
                }
            }

            this.redisClients.on('ready', () => {
                logger.info('Redis connected successfully.');
                counter += 1;
                check.call(this);
            });

            this.redisClients.on('error', (error: any) => {
                console.log('CATCH_ERROR : Redis Client error:', error)
                logger.error('CATCH_ERROR : Redis Client error:', error);
                reject(error);
            });

            this.redisPubClients.on('ready', () => {
                logger.info('pubClient connected successfully.');
                counter += 1;
                check.call(this);
            });

            this.redisPubClients.on('error', (error: any) => {
                console.log('CATCH_ERROR : Redis Pub Client error:', error)
                logger.error('CATCH_ERROR : pubClient Client error:', error);
                reject(error);
            });

            await this.redisClients.connect();
            await this.redisPubClients.connect();
            await this.redisSubClients.connect()

        })
    }

    get redisClient(){
        return this.redisClients;
    }
    get redisSubClient(){
        return this.redisSubClients;
    }

    get redisPubClient(){
        return this.redisPubClients
    }
}

export const redisConnection = new RedisConnection();
