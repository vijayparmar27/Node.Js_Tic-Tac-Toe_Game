const multer = require('multer');
import { ObjectId } from "mongodb";

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, 'upload/')
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, new ObjectId() + file.originalname)
    }
});

export const multerUpload = multer({ storage: storage });