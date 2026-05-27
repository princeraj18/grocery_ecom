import { v2 as cloudinary } from "cloudinary";

let cloudAvailable = false;

const sanitize = (v) => {
  if (v === undefined || v === null) return v;
  let s = String(v).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
};

export const connectCloudinary = async () => {
  const cfg = {
    cloud_name: sanitize(process.env.CLOUD_NAME),
    api_key: sanitize(process.env.CLOUD_API_KEY),
    api_secret: sanitize(process.env.CLOUD_API_SECRET),
  };

  const missing = Object.entries(cfg).filter(([, val]) => !val).map(([k]) => k);
  if (missing.length) {
    console.warn("Cloudinary credentials missing or empty:", missing.join(", "));
    cloudAvailable = false;
    return cloudAvailable;
  }

  cloudinary.config(cfg);

  try {
    const res = await cloudinary.api.ping();
    cloudAvailable = true;
    console.log("Cloudinary ping success");
  } catch (err) {
    cloudAvailable = false;
    console.error("Cloudinary ping failed:", err);
  }
  return cloudAvailable;
};

export const isCloudAvailable = () => cloudAvailable;

export { cloudinary };