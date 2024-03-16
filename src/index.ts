import { connectionInit } from "./connection";
import logger from "./logger";


(async () => {
    await connectionInit()

    process
        .on('unhandledRejection', (reason, p) => {
            console.log(reason)
            console.log(p)
            logger.error(
                reason,
                'Unhandled Rejection at Promise >> ',
                new Date(),
                ' >> ',
                p,
            );
        })
        .on('uncaughtException', (err) => {
            console.log(err)
            logger.error('Uncaught Exception thrown', new Date(), ' >> ', '\n', err);
        });
})()