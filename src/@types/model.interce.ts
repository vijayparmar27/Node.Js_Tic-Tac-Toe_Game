import { Document } from "mongoose"

export interface ProductIf extends Document {
    productName: string;
    category: string;
    brandName: string;
    productImage: string;
    price: number;
    unitName: string;
    unitQuantity: number;
    productDescription: string;
}

export interface UserIf extends Document {
    fullName: string;
    userName: string;
    email: string;
    phoneNo: string;
    password: string;
    amount: number;
    win: number;
    loss: number;
    tie: number;
    flags: {
        isRejoin: boolean;
    };
    lastTableId: string;
}


export interface LobbySchemaIf extends Document {
    amount: number;
    isBotActive: boolean;
    mode: string;
    commission: number;
    gameType: number;
}

export interface tableQueueSchemaIf extends Document {
    tableIds: string[]
    lobbyId: string;
}

export interface Player {
    userId: string;
    userName: string;
    playerState: string;
    seatIndex: number;
    rematch: boolean;
    isTakeTurn: boolean;
    turnMissCount: number;
    symbol: string;
    socketId: string;
    createAt: Date;
    updateAt: Date;
}


export interface playingTableSchemaIf extends Document {
    activePlayers: number;
    totalPlayers: number;
    maxPlayers: number;
    gameType: string; // You need to define gameType elsewhere
    tableState: string;
    currentTurnUserId: string;
    currentTurnIndex: number;
    dealerIndex: number;
    dealerUserId: string;
    totalTurns: number;
    isGameEnd: boolean;
    lobbyId: string;
    bootValue: number;
    potValue: number;
    userIds: string[];
    isTie: boolean;
    players: Player[] | Object[];
    gameBoard: any; // Define type for gameBoard
    createAt: Date;
    updateAt: Date;
}