const cloudinary = require('cloudinary').v2;
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

module.exports = cloudinary;

// 'INSERT into images (cloudinary_id, image_url) VALUES ($1, $2) RETURNING *',
// 				[image.public_id, image.secure_url]
