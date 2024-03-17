import mongoose from "mongoose";
import { tableQueueSchemaIf } from "../@types/model.interce";

const tableQueueSchema = new mongoose.Schema<tableQueueSchemaIf>({
    lobbyId: { type: String, required: true },
    tableIds: {
        type: [String],
        default: []
    }
})

 // Create and export the model
 const tableQueueModel = mongoose.model<tableQueueSchemaIf>('tableQueue', tableQueueSchema);
 export default tableQueueModel;