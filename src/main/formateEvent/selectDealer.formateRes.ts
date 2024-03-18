import { EVENTS } from "../../constants";
import logger from "../../logger";

export function selectDealerFormateRes(data: any[], tableId: string): any {
    try {
        return {
            "en": EVENTS.SELECT_DEALER,
            "data": {
                "tableId": tableId,
                "playerDetails": data
            }
        };
    } catch (error) {
        logger.error("------ selectDealerFormateRes :: ERROR :: ", error);
        throw error;
    }
}
