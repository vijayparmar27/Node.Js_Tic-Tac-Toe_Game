import logger from "../../logger";

export function timeDifference(nowDate: Date, previousDate: Date, timer: number): number {
    try {
        const now = new Date(nowDate).getTime();
        const previous = new Date(previousDate).getTime();
        const Diff = (now - previous) / 1000;
        const diff = timer - Diff

        if (diff > 0) {
            return Math.floor(diff);
        } else {
            return 0;
        }
    } catch (error) {
        logger.error("---timeDifference :: ERROR ::", error);
        throw error;
    }
}