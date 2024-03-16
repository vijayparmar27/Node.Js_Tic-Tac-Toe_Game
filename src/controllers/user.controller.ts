import UserModel from "../models/user.model";
import { decryptData, encryptData } from "../services/encryptAndDecrypt.service";
import { generateToken } from "../services/jwt.service";
import mongoService from "../services/mongo.service";

export async function signupController(request: any, res: any) {
    try {

        console.log("------ request :: ", request.body);

        if (request.password !== request.confPassword) {
            return res.json({
                status: false,
                message: "Comfirm Password Not Same !",
                statusCode: 406,
                data: null
            });
        }

        const query = {
            "$or": [
                { "userName": request.userName },
                { "email": request.email },
            ]
        };

        const data = await mongoService.findOne(UserModel, {
            query: query
        });

        if (data) {
            return res.json({
                status: false,
                message: "Account aleady exsist !",
                statusCode: 226,
                data: null
            });
        }

        const hashed_password = await encryptData(request.body.password);
        console.log("--------  Hash.get_hash(request.password) :: ", hashed_password);

        const insert_data = {
            fullName: request.body.fullName,
            userName: request.body.userName,
            email: request.body.email,
            phoneNo: "000000000",
            password: hashed_password
        };

        const userSaveData = new UserModel(insert_data)

        const res_data = await userSaveData.save();

        if (res_data) {
            return res.json({
                status: true,
                message: "Acoount has created !",
                statusCode: 201,
                data: null
            });
        }

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

export async function loginController(request: any, res: any) {

    try {

        const query = {
            "$or": [
                { "userName": request.body.uniqueId },
                { "email": request.body.uniqueId },
            ]
        };

        const data = await mongoService.findOne(UserModel, {
            query: query
        });
        console.log("------- data :: ", data);

        if (!data) {

            return res.json({
                status: false,
                message: "data not avaible ! !",
                statusCode: 406,
                data: null
            });
        }
        const is_valid_password = decryptData(request.body.password, data.password);

        if (!is_valid_password) {
            return res.json({
                status: false,
                message: "Invalid Password !",
                statusCode: 406,
                data: null
            });
        }

        console.log("--- data._id :: ", data._id);

        const generat_token = await generateToken({ "id": data._id });

        delete data.password;

        return res.json({
            status: true,
            message: "Login Successfuly !",
            statusCode: 200,
            data: {
                accessToken: generat_token,
                userInfo: data
            }
        })
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
