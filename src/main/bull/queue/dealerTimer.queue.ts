import logger from "../../../logger";
import { dealerTimerProcess } from "../processes/dealerTimer.process";
import QueueBaseClass from "./queueBaseClass";

class DealerTimerQueue extends QueueBaseClass {
    constructor() {
        super("DealerTimerQueue");
        this.queue.process(dealerTimerProcess)

    }

    dealerTimerQueue = async (data: {
        timer: number,
        jobId: string,
        tableId: string,
    }) => {
        try {

            logger.info(`-------- DealerTimerQueue :: data :: `, data);
            const queueOption = {
                delay: data.timer, // in ms
                jobId: data.jobId,
                removeOnComplete: true,
            };

            logger.info('-- ');
            logger.info(queueOption, ' DealerTimerQueue ------ ');
            logger.info('-- ');

            await this.queue.add(data, queueOption);

        } catch (error) {
            logger.error("--- dealerTimerQueue :: ERROR ::", error);
        }
    }

}

export const dealerTimerQueue = new DealerTimerQueue().dealerTimerQueue;

