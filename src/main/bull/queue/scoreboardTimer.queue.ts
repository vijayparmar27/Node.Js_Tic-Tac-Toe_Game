import logger from "../../../logger";
import { scoreboardTimerProcess } from "../processes/scoreboardTimer.process";
import QueueBaseClass from "./queueBaseClass";

class ScoreboardTimerQueue extends QueueBaseClass {
    constructor() {
        super("ScoreboardTimerQueue");
        this.queue.process(scoreboardTimerProcess)

    }

    scoreboardTimerQueue = async (data: {
        timer: number,
        tableId: string,
    }) => {
        try {

            logger.info(`-------- scoreboardTimerQueue :: data :: `, data);
            const queueOption = {
                delay: data.timer, // in ms
                jobId: data.tableId,
                removeOnComplete: true,
            };

            logger.info('-- ');
            logger.info(queueOption, ' scoreboardTimerQueue ------ ');
            logger.info('-- ');

            await this.queue.add(data, queueOption);

        } catch (error) {
            logger.error("--- RoundTimerStartQueue :: ERROR ::", error);
        }
    }

}

export const scoreboardTimerQueue = new ScoreboardTimerQueue().scoreboardTimerQueue;

