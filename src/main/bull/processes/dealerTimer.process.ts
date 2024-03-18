import logger from "../../../logger";
import { firstTurn } from "../../gamePlay/turn/firstTurn";

export async function dealerTimerProcess(job: any) {
    try {
        logger.info("---->> dealerTimerProcess :: JOB ::", job)
        logger.info("---->> dealerTimerProcess :: Job Data ::", job.data)
        firstTurn(String(job.data.tableId))
    } catch (error) {
        logger.error(`------- dealerTimerProcess :: ERROR :: `, error);
    }
}