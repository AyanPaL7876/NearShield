// cloudinaryService.js
// Handles image uploads to Cloudinary


export const uploadImageToCloudinary = async (uri) => {
    try {
      const formData = new FormData();
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename ?? '');
      const type = match ? `image/${match[1]}` : `image`;
  
      formData.append('file', {
        uri,
        name: filename,
        type,
      });
  
      formData.append('upload_preset', 'my_preset');  // Replace with your actual preset
      formData.append('cloud_name', 'dlkqamlap');
  
      const response = await fetch(`https://api.cloudinary.com/v1_1/dlkqamlap/image/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // Don't manually set 'Content-Type' as it breaks multipart/form-data boundary
        }
      });
  
      const data = await response.json();
  
      if (data.secure_url) {
        return data.secure_url;
      } else {
        console.error('Cloudinary Error:', data);
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };


//deleteImageFromCloudinary.js
// Handles image deletions from Cloudinary
