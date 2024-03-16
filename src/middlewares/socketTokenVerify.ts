import logger from "../logger";
import { verifyToken } from "../services/jwt.service";

export async function socketTokenVerify(token: string) {
    try {

        const data = await verifyToken(token);

        if (data) {
            return data.id
        }

        return false;

    } catch (error) {
        logger.error(`------ socketTokenVerify :: ERROR :: `, error);
        return false;
    }
}