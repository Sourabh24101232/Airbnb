const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//add cloudinary with backend using data from .env file
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

//make our storage (code copied from npm and then edited)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    // format: async (req, file) => 'png', // supports promises as well
    allowedFormats:["jpg","png","jpeg","pdf"]
    // public_id: (req, file) => 'computed-filename-using-request',
  },
});

module.exports={cloudinary,storage};