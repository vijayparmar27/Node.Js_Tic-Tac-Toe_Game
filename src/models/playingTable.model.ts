import { Schema, Document, model } from 'mongoose';
import { Player, playingTableSchemaIf } from '../@types/model.interce';

const playerSchema = new Schema<Player>({
    userId: { type: String },
    userName: { type: String },
    playerState: { type: String },
    seatIndex: { type: Number },
    rematch: { type: Boolean },
    isTakeTurn: { type: Boolean },
    turnMissCount: { type: Number },
    symbol: { type: String },
    socketId: { type: String },
    createAt: { type: Date },
    updateAt: { type: Date }
});

const playingTableSchema = new Schema<playingTableSchemaIf>({
    activePlayers: { type: Number, required: true },
    totalPlayers: { type: Number, required: true },
    maxPlayers: { type: Number, required: true },
    gameType: { type: String, required: true },
    tableState: { type: String },
    currentTurnUserId: { type: String },
    currentTurnIndex: { type: Number },
    dealerIndex: { type: Number, required: true },
    dealerUserId: { type: String },
    totalTurns: { type: Number, required: true },
    isGameEnd: { type: Boolean, required: true },
    lobbyId: { type: String, required: true },
    bootValue: { type: Number, required: true },
    potValue: { type: Number, required: true },
    userIds: { type: [String], required: true },
    isTie: { type: Boolean, required: true },
    players: {
        type: [playerSchema]    
    },
    gameBoard: { type: Schema.Types.Mixed, required: true },
    createAt: { type: Date, required: true },
    updateAt: { type: Date, required: true }
});

export const PlayingTableModel = model<playingTableSchemaIf>('playingTable', playingTableSchema);
