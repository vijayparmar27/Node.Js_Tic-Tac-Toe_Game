import logger from "../../logger";

export function nextIndex(index: number, max: number): number {
    try {
        return (index + 1) % max;
    } catch (error) {
        logger.error("---- nextIndex ::: ERROR :: ", error);
        throw error;
    }
}
