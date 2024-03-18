import logger from "../../../logger";
import { roundTimerProcess } from "../processes/roundTimerStart.process";
import QueueBaseClass from "./queueBaseClass";

class RoundTimerStartQueue extends QueueBaseClass {
    constructor() {
        super("RoundTimerStartQueue");
        this.queue.process(roundTimerProcess)

    }

    roundTimerStartQueue = async (data: {
        timer: number,
        jobId: string,
        tableId: string,
    }) => {
        try {

            logger.info(`-------- RoundTimerStartQueue :: data :: `, data);
            const queueOption = {
                delay: data.timer, // in ms
                jobId: data.jobId,
                removeOnComplete: true,
            };

            logger.info('-- ');
            logger.info(queueOption, ' RoundTimerStartQueue ------ ');
            logger.info('-- ');

            await this.queue.add(data, queueOption);

        } catch (error) {
            logger.error("--- RoundTimerStartQueue :: ERROR ::", error);
        }
    }

}

export const roundTimerStartQueue = new RoundTimerStartQueue().roundTimerStartQueue;

