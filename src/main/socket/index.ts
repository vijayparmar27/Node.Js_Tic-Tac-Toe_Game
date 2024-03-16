import { socketConnection } from "../../connection/socket";
import logger from "../../logger";

export class SocketEventSend {

    constructor() {
    }

    static async sendEventToClient(data: any, socket: any) {

        try {

            if (data.en != 'HEART_BEAT') logger.debug('SEND EVENT TO CLIENT: ', data);
            let encData = JSON.stringify(data);

            if (typeof socket !== "string" && socket.emit) {
                socket.emit(data.en, encData)
            } else {
                const socketClient: any = socketConnection.socketClient;
                socketClient.to(socket).emit(data.en, encData)
            }
        } catch (error) {
            console.log(error)
            logger.error('SEND EVENT TO CLIENT  :: ERROR :: ', error);
        }

    }

    static async sendEventToRoom(roomId: any, data: any) {
        try {
            const socketClient = await socketConnection.socketClient;
            logger.debug('SEND EVENT TO ROOM roomId', roomId);
            logger.debug('SEND EVENT TO ROOM', data);

            let encData = JSON.stringify(data);

            socketClient.to(roomId).emit(data.en, encData);

        } catch (error) {
            logger.error('SEND ENEVT TO ROOM :: ERROR :: ', error);
            console.log(error)
        }
    }

    static async addClientInRoom(socket: any, roomId: any) {
        if (socket?.id !== "FTUE_BOT_ID") {
            logger.debug("addClientInRoom :: ", roomId)
            return socket.join(roomId)
        } else {
            let socketInstance = await this.getSocketFromSocketId(socket);
            if (socketInstance && socketInstance.join) {
                socketInstance.join(roomId)
            }
        }
    }

    static async leaveClientInRoom(socket: any, roomId: any) {
        try {
            if (typeof socket != 'undefined' && socket.emit) {
                socket.leave(roomId);
            } else {
                let socketInstance = await this.getSocketFromSocketId(socket);
                if (socketInstance && socketInstance.leave) {
                    socketInstance.leave(roomId)
                }
            }
        } catch (error) {
            console.log("LEAVE CLIENT SOCKET ROOM :: ERROR ::", error)
            logger.error("LEAVE CLIENT SOCKET ROOM :: ERROR ::", error)
        }
    }

    static getSocketFromSocketId(socket: any) {
        try {

            const socketClient = socketConnection.socketClient;
            if (typeof socket !== "string" && socket.emit) {
                return socketClient.sockets.sockets.get(socket.id)
            }
            return socketClient.sockets.sockets.get(socket);
        } catch (error) {
            logger.error("GET SOCKET FROM SOCKET ID :: EROOR ::", error)
        }
    }

    static async getAllSocket(tableId: string) {
        try {
            const socketClient = socketConnection.socketClient;
            return await socketClient.in(tableId).fetchSockets();
        } catch (error) {
            logger.error("GET ALL SOCKET FROM ROOM :: EROOR ::", error)
        }
    }

    static async joinRoomSocketId(roomId: string) {
        try {
            const socketClient = socketConnection.socketClient;
            const sockets = await socketClient.sockets.adapter.rooms.get(roomId);
            let setArrary: string[] = []
            if (sockets) {
                setArrary = [...sockets]
            }

            return setArrary;

        } catch (error) {
            logger.error("------ joinRoomSocketId :: EROOR ::", error);
            return []
        }
    }

    static async socketDisconnect(socket: any) {
        if (typeof socket !== "string" && socket.emit) {
            socket.disconnect()
        } else {
            const socketClient: any = socketConnection.socketClient;
            socketClient.to(socket).disconnect()
        }
    }
}
