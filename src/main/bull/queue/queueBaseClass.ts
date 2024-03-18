import Bull from "bull";
import Config from "../../../config/config"

class QueueBaseClass {
    public queue;

    constructor(queueName: string) {
        const { RDS_HOST, REDIS_PORT, RDS_AUTH, REDIS_DB, } = Config;

        const redisConfig: {
            host: string,
            port: number,
            db: number,
            password?: string
        } = {
            host: RDS_HOST,
            port: REDIS_PORT,
            db: REDIS_DB
        }

        if (RDS_AUTH !== "") {
            redisConfig.password = RDS_AUTH
        }


        this.queue = new Bull(queueName, { redis: redisConfig })

    }
}

export default QueueBaseClass;