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