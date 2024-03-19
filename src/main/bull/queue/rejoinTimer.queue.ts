import logger from "../../../logger";
import { rejoinTimerProcess } from "../processes/rejoinTimer.process";
import QueueBaseClass from "./queueBaseClass";

class RejoinTimerQueue extends QueueBaseClass {
    constructor() {
        super("RejoinTimerQueue");
        this.queue.process(rejoinTimerProcess)

    }

    rejoinTimerQueue = async (data: {
        timer: number,
        tableId: string,
        username: string,
    }) => {
        try {

            logger.info(`-------- RejoinTimerQueue :: data :: `, data);
            const queueOption = {
                delay: data.timer, // in ms
                jobId: `${data.tableId}:${data.username}`,
                removeOnComplete: true,
            };

            logger.info('-- ');
            logger.info(queueOption, ' RejoinTimerQueue ------ ');
            logger.info('-- ');

            await this.queue.add(data, queueOption);

        } catch (error) {
            logger.error("--- rejoinTimerQueue :: ERROR ::", error);
        }
    }

}

export const rejoinTimerQueue = new RejoinTimerQueue().rejoinTimerQueue;

