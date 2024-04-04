import imageCompression from "browser-image-compression";
const convertImage2JpgV2 = async (image, quality = 0.7, maxSizeMB = 0.3) => {
  const options = {
    maxSizeMB: maxSizeMB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: quality,
    fileType: "image/jpeg",
  };
  try {
    const compressedFile = await imageCompression(image, options);
    return compressedFile;
  } catch (e) {
    return image;
  }
  // imageCompression.
};
export default convertImage2JpgV2;
