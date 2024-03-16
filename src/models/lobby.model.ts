import mongoose, { Schema, Document } from 'mongoose';
import { LobbySchemaIf } from '../@types/model.interce';

const LobbySchema: Schema = new Schema({
    amount: { type: Number, required: true, default: 0 },
    is_bot_active: { type: Boolean, required: true, default: false },
    mode: { type: String, required: true, default: 'cash' },
    commission: { type: Number, required: true, default: 0 },
    gameType: { type: Number, required: true, default: 3 }
});

// Define and export the model
const LobbyModel = mongoose.model<LobbySchemaIf>('Lobby', LobbySchema);

export default LobbyModel;