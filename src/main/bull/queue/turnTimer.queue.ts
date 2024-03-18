import logger from "../../../logger";
import { tuneTimerProcess } from "../processes/turnTimer.process";
import QueueBaseClass from "./queueBaseClass";

class TurnTimerQueue extends QueueBaseClass {
    constructor() {
        super("TurnTimerQueue");
        this.queue.process(tuneTimerProcess)

    }

    turnTimerQueue = async (data: {
        timer: number,
        tableId: string,
        turnPlayerId: string,
        turnPlayerSeatIndex: number
    }) => {
        try {

            logger.info(`-------- TurnTimerQueue :: data :: `, data);
            const queueOption = {
                delay: data.timer, // in ms
                jobId: data.tableId,
                removeOnComplete: true,
            };

            logger.info('-- ');
            logger.info(queueOption, ' TurnTimerQueue ------ ');
            logger.info('-- ');

            await this.queue.add(data, queueOption);

        } catch (error) {
            logger.error("--- TurnTimerQueue :: ERROR ::", error);
        }
    }

}

export const turnTimerQueue = new TurnTimerQueue().turnTimerQueue;

