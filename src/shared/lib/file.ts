import imageCompression from "browser-image-compression";

export const validateImage = (file: File) => {
  const validTypes = ["image/jpeg", "image/png"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Định dạng file không hợp lệ (Chỉ chấp nhận JPG, PNG)");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Dung lượng file không được vượt quá 5MB");
  }
};

export const compressAvatar = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 512,
    useWebWorker: true,
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Compression failed:", error);
    return file;
  }
};
