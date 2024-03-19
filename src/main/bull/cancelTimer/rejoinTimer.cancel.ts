import logger from "../../../logger";
import QueueBaseClass from "../queue/queueBaseClass";

class RejoinTimerCancel extends QueueBaseClass {
    constructor() {
        super("RejoinTimerQueue");
    }

    rejoinTimerCancel = async (jobId: any) => {
        try {

            logger.debug('------>> RejoinTimerCancel :: JOB CANCELLED  :: JOB ID:" ---- ', jobId , typeof jobId);

            if(!jobId){
                return;
            }

            const jobData = await this.queue.getJob(jobId)
            logger.info('------>> RejoinTimerCancel :: JOB CANCELLED :: JOB ID:" job ---- ', jobData);
            
            if (jobData !== null) {
                logger.info("===========>> RejoinTimerCancel :: JOB AVAILABLE :: ");
                await jobData.remove();
            } else {
                logger.warn("===========>> RejoinTimerCancel :: JOB NOT AVAILABLE :: ");
            }

            return jobData;
        } catch (error) {
            logger.error('CATCH_ERROR : RejoinTimerCancel --:', jobId, error);
        }
    }
}

export const rejoinTimerCancel = new RejoinTimerCancel().rejoinTimerCancel;