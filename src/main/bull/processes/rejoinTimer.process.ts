import logger from "../../../logger";

export async function rejoinTimerProcess(job: any) {
    try {
        logger.info("---->> rejoinTimerProcess :: JOB ::", job)
        logger.info("---->> rejoinTimerProcess :: Job Data ::", job.data)
        
        // REMOVE PLAYER DATA AND OTHER PLAYER WIN


    } catch (error) {
        logger.error(`------- rejoinTimerProcess :: ERROR :: `, error);
    }
}