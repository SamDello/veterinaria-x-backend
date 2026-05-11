const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

function uploadImageBuffer(buffer, folder = 'veterinaria_x/mascotas') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
}

async function deleteImage(publicId) {
  if (!publicId) return null;

  return cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
  });
}

module.exports = {
  uploadImageBuffer,
  deleteImage,
};