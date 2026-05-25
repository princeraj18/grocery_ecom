import dotenv from 'dotenv';
import path from 'path';

// Load backend .env before importing cloudinary config
dotenv.config({ path: path.join(process.cwd(), '.env') });

(async () => {
  const { cloudinary, connectCloudinary } = await import('../config/cloudinary.js');
  connectCloudinary();
  try {
    const imagePath = path.join(process.cwd(), '..', 'frontend', 'src', 'assets', 'frontend_assets', 'p_img1.png');
    console.log('Uploading', imagePath);
    const res = await cloudinary.uploader.upload(imagePath, { resource_type: 'auto', folder: 'test_uploads' });
    console.log('Upload success:', res);
  } catch (err) {
    console.error('Upload error:', err);
  }
})();
