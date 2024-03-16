import { Request, Response } from 'express';
import mongoService from '../services/mongo.service';
import LobbyModel from '../models/lobby.model';

export async function createLobby(req: Request, res: Response) {
    try {
        const lobby = req.body; // Assuming lobby data is sent in the request body

        const data = await mongoService.findOne(LobbyModel, { query: { amount: lobby.amount } });

        if (data) {
            return res.status(200).json({
                status: true,
                message: "This lobby already exists!",
                statusCode: 200,
                data: null
            });
        }

        const lobbySaveData = new LobbyModel(lobby)
        const res_data = await lobbySaveData.save()

        if (res_data) {
            return res.status(201).json({
                status: true,
                message: "Lobby has been created!",
                statusCode: 201,
                data: res_data.toString()
            });
        }

        return res.status(400).json({
            status: true,
            message: "Some issue from the server side!",
            statusCode: 400,
            data: null
        });
    } catch (error) {
        console.log("--- error :: ", error)
        return res.json({
            status: false,
            message: "some issue from server side !",
            statusCode: 200,
            data: null
        });
    };
}

export async function getLobby(req: Request, res: Response) {
    try {
        console.log("----- getLobby :: ");
        const lobbyData = await mongoService.find(LobbyModel);

        console.log("----- getLobby :: ", getLobby);

        return res.status(226).json({
            status: false,
            message: "Account already exists!",
            statusCode: 226,
            data: lobbyData
        });
    } catch (error) {
        console.log("--- error :: ", error)
        return res.json({
            status: false,
            message: "some issue from server side !",
            statusCode: 200,
            data: null
        });
    };
}
