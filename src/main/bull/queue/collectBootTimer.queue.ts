import logger from "../../../logger";
import { collectBootTimerProcess } from "../processes/collectBootTimer.process";
import QueueBaseClass from "./queueBaseClass";

class CollectBootTimerQueue extends QueueBaseClass {
    constructor() {
        super("CollectBootTimerQueue");
        this.queue.process(collectBootTimerProcess)

    }

    collectBootTimerQueue = async (data: {
        timer: number,
        jobId: string,
        tableId: string,
    }) => {
        try {

            logger.info(`-------- CollectBootTimerQueue :: data :: `, data);
            const queueOption = {
                delay: data.timer, // in ms
                jobId: data.jobId,
                removeOnComplete: true,
            };

            logger.info('-- ');
            logger.info(queueOption, ' CollectBootTimerQueue ------ ');
            logger.info('-- ');

            await this.queue.add(data, queueOption);

        } catch (error) {
            logger.error("--- CollectBootTimerQueue :: ERROR ::", error);
        }
    }

}

export const collectBootTimerQueue = new CollectBootTimerQueue().collectBootTimerQueue;

