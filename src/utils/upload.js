import multer from "multer";
import path from "path"
import os from "os"


const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, os.tmpdir());
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedExtention = /pdf/
    const extName = allowedExtention.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedExtention.test(file.mimetype)
    if (extName && mimetype) {
        return cb(null, true)
    } else {
        return cb(new Error('Only pdf file allowed'), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
})

export default upload