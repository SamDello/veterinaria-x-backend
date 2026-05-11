const multer = require('multer');

const storage = multer.memoryStorage();

const imageUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Solo se permiten imágenes JPG, JPEG, PNG o WEBP.'));
    }

    cb(null, true);
  },
});

module.exports = {
  imageUpload,
};