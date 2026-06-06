import multer from "multer";
import path from "path"



const storage = multer.diskStorage({
    destination: "./uploads",
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