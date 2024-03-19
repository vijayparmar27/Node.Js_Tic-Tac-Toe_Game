import { Server } from "socket.io";
import { serverConnection } from './httpServer';
const { createAdapter } = require('@socket.io/redis-adapter');
import logger from '../logger';
import { redisConnection } from './redis';
import { MESSAGES, NUMERICAL, SOCKET } from '../constants';
import { requestHandler } from "../main/events";
import { disconnectSocket } from "../main/disconnect";

class SocketConnection {
    private socketClientIo: any;
    constructor() {

    }

    async socketConnect() {

        const pubClient = redisConnection.redisPubClient;
        const subClient = redisConnection.redisSubClient;
        const { redisClient, redisPubClient, redisSubClient } = redisConnection;

        const socketConfig = {
            transports: [SOCKET.WEBSOCKET, SOCKET.POLLING],
            pingInterval: 4000, // to send ping/pong events for specific interval (milliseconds)
            pingTimeout: NUMERICAL.TEN_THOUSAND, // if ping is not received in the "pingInterval" seconds then milliseconds will be disconnected in "pingTimeout" milliseconds
            allowEIO3: true,
        };
        const httpServer: any = serverConnection.httpserver
        this.socketClientIo = new Server(httpServer, socketConfig);

        this.socketClientIo.adapter(createAdapter(redisPubClient, redisSubClient));

        this.socketClientIo.on(SOCKET.CONNECTION, this.connectionCB);

    }

    private async connectionCB(client: any) {

        try {
            logger.info(MESSAGES.SOCKET.INTERNAL.NEW_CONNECTION, client.id);

            // const token = client.handshake.auth.token;
            // const userId = client.handshake.auth.userId; // remove
            // logger.info('connectionCB token : ', token);

            client.conn.on(SOCKET.PACKET, (packet: any) => {

                if (packet.type === 'ping') {
                }
            });

            /**
             * error event handler
             */
            client.on(SOCKET.ERROR, (error: any) =>
                logger.error('CATCH_ERROR : Socket : client error......,', error),
            );

            /**
             * disconnect request handler
             */
            client.on(SOCKET.DISCONNECT, async (disconnectReason: any) => {
                console.log("disconnect... :: disconnectReason :: ", disconnectReason)
                disconnectSocket(client, disconnectReason);
            })

            /**
             * bind requestHandler
             */

            client.use(requestHandler.bind(client));

        } catch (error) {
            console.log("error: ", error);
        }

    }

    get socketClient() {
        return this.socketClientIo;
    }
}

export const socketConnection = new SocketConnection();



