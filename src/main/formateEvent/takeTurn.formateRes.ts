import { EVENTS } from "../../constants";
import logger from "../../logger";

export function takeTurnResFormate(index: any, symbol: any, tableId: any): any {
    try {
        return {
            "en": EVENTS.TAKE_TURN,
            "data": {
                "tableId": tableId,
                "index": index,
                "symbol": symbol
            }
        };
    } catch (error) {
        logger.error("----- takeTurnResFormate :: ERROR :: ", error);
        throw error;
    }
}
