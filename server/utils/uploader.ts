import multer from 'multer';

const fileUpload = multer.memoryStorage();

const upload = multer({ storage: fileUpload });

export default upload;
