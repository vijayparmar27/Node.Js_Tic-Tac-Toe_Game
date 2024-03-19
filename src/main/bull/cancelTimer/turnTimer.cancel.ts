import logger from "../../../logger";
import QueueBaseClass from "../queue/queueBaseClass";

class TurnTimerCancel extends QueueBaseClass {
    constructor() {
        super("TurnTimerQueue");
    }

    turnTimerCancel = async (jobId: any) => {
        try {

            logger.debug('------>> TurnTimerCancel :: JOB CANCELLED  :: JOB ID:" ---- ', jobId , typeof jobId);

            if(!jobId){
                return;
            }

            const jobData = await this.queue.getJob(jobId)
            logger.info('------>> TurnTimerCancel :: JOB CANCELLED :: JOB ID:" job ---- ', jobData);
            
            if (jobData !== null) {
                logger.info("===========>> TurnTimerCancel :: JOB AVAILABLE :: ");
                await jobData.remove();
            } else {
                logger.warn("===========>> TurnTimerCancel :: JOB NOT AVAILABLE :: ");
            }

            return jobData;
        } catch (error) {
            logger.error('CATCH_ERROR : TurnTimerCancel --:', jobId, error);
        }
    }
}

export const turnTimerCancel = new TurnTimerCancel().turnTimerCancel;