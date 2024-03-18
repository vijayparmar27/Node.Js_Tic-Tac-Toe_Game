import logger from "../../../logger";
import { collectBootValue } from "../../gamePlay/collectBoot/collectBootValue";

export async function roundTimerProcess(job: any) {
    try {
        logger.info("---->> roundTimerProcess :: JOB ::", job)
        logger.info("---->> roundTimerProcess :: Job Data ::", job.data)

        collectBootValue(String(job.data.tableId))
    } catch (error) {
        logger.error(`------- roundTimerProcess :: ERROR :: `, error);
    }
}