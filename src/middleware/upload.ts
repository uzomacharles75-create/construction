import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => {
    return {
      folder: 'buildhub-docs',
      resource_type: 'auto', // Important for PDFs and CAD files
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '').replace(/[^\w-]/g, '_')}`,
    };
  },
});

export const upload = multer({ storage: storage });