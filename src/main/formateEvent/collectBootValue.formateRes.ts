import { EVENTS } from "../../constants";
import logger from "../../logger";

export function collectBootValueFormateRes(
    userData: any[],
    bootValue: number,
    winAmount: number,
    tableId: string
): any {
    try {
        return {
            "en": EVENTS.COLLECT_BOOT,
            "data": {
                "tableId": tableId,
                "bootValue": bootValue,
                "winAmount": winAmount,
                "playerDetails": userData,
            }
        };
    } catch (error) {
        logger.info("----- collectBootValueFormateRes :: ERROR :: ", error);
        throw error;
    }
}
