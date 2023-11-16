const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
  });
  
  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto"
  }

  module.exports = (image) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (err, result) => {
            console.log(result)
            if ( result && result.secure_url) {
                console.log(result.secure_url);
                return resolve(result.secure_url)
            }
            console.log('24'+err.message)
            return reject({message: err.message})
        })
    })
  }