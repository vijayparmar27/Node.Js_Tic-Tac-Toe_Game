import logger from "../../../logger";
import { selectDealer } from "../../gamePlay/dealer/selectDealer";

export async function collectBootTimerProcess(job: any) {
    try {
        logger.info("---->> collectBootTimerProcess :: JOB ::", job)
        logger.info("---->> collectBootTimerProcess :: Job Data ::", job.data)
        selectDealer(String(job.data.tableId))
    } catch (error) {
        logger.error(`------- collectBootTimerProcess :: ERROR :: `, error);
    }
}