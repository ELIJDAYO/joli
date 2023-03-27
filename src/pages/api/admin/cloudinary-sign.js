const cloudinary = require('cloudinary').v2;

export default function signature(req, res) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  //   And by using this signature, you can upload image to the cloud ordinary server.
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_SECRET
  );

  res.statusCode = 200;
  //  In front-end by using these two values, we can have access to upload file to the cloud ordinary
  res.json({ signature, timestamp });
}
