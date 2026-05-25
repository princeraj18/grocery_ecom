import multer from "multer";

// Use memory storage so controller can decide to upload to Cloudinary
// and fallback to local disk if Cloudinary is unavailable.
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;