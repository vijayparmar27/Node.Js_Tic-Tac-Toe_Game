import logger from "../logger";
import { serverConnection } from "./httpServer";
import { mongoConnection } from "./mongoConection";
import { redisConnection } from "./redis";
import { socketConnection } from "./socket";

export async function connectionInit() {
    try {
        await Promise.all([
            redisConnection.redisConnect(),
            serverConnection.listenServer(),
            mongoConnection.init()
        ]);

        socketConnection.socketConnect()

    } catch (error) {
        logger.error("------ connectionInit :: ERROR :: ", error);
    }
}