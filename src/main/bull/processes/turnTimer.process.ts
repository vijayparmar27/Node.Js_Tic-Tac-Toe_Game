import logger from "../../../logger";
import { changeTurn } from "../../gamePlay/turn/changeTurn";

export async function tuneTimerProcess(job: any) {
    try {
        logger.info("---->> tuneTimerProcess :: JOB ::", job)
        logger.info("---->> tuneTimerProcess :: Job Data ::", job.data)
        changeTurn(
            job.data.turnPlayerId,
            job.data.turnPlayerSeatIndex,
            String(job.data.tableId)
        )
    } catch (error) {
        logger.error(`------- tuneTimerProcess :: ERROR :: `, error);
    }
}