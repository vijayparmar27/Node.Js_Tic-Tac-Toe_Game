import { Request, Response } from "express"
import logger from "../logger"
import { ProductReqIf } from "../@types/request.interface";
import { ProductModel } from "../models/product.model";
import { GLOBLE } from "../constants";

export const addProduct = async (req: any, res: Response) => {
    try {
        logger.info(`------ addProduct :: req.body ::`, req.body)

        if(!req.file){
           return res.status(400).json({
                status: false,
                message: "image required !",
                statusCode: 400,
                data: null
            })
        }

        const newProduct = new ProductModel({
            "productName": req.body.productName,
            "category": req.body.category,
            "brandName": req.body.brandName,
            "productImage": `${GLOBLE.SERVER_ULI}/${req.file.filename}`,
            "price": Number(req.body.price),
            "unitName": req.body.unitName,
            "unitQuantity": Number(req.body.unitQuantity),
            "productDescription": req.body.productDescription
        });

        const savedProduct = await newProduct.save();
        res.status(200).json({
            status: true,
            message: "successfuly !",
            statusCode: 200,
            data: savedProduct
        });

    } catch (error) {
        logger.error("----- addProduct :: ERROR :: ", error);
        res.status(400).json({
            status: false,
            message: "somthing wrong !",
            statusCode: 400,
            data: null
        })
    }
}

export const getProduct = async (req: Request, res: Response) => {
    try {

        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 10;

        const skip = (page - 1) * pageSize;

        const products = await ProductModel.find()
            .skip(skip)
            .limit(pageSize);

        res.status(200).json({
            status: true,
            message: "successfuly !",
            statusCode: 200,
            data: products
        });

    } catch (error) {
        logger.error("----- getProduct :: ERROR :: ", error);
        res.status(400).json({
            status: false,
            message: "somthing wrong !",
            statusCode: 400,
            data: null
        })
    }
}