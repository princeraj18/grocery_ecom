import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;

  if (!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_API_SECRET) {
    console.warn(
      "Cloudinary credentials missing. Please set CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET in environment or .env"
    );
  }

  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET,
  });

  console.log("Cloudinary Connected");
};

export {
  cloudinary,
  connectCloudinary,
};