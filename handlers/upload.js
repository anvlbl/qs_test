import multer from "multer";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, '../uploads')
    },
    filename(req, file, cb) {
        cb(null, 'avatar')
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const limits = {
    fileSize: 1024 * 1024,
}

const config = multer({
    storage: storage,
    fileFilter: fileFilter,
    fileSize: fileSize,
})

export { uploadConfig };