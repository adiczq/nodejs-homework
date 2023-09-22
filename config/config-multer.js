import multer from "multer";

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("I don't have a clue!"));
  }
};
const storageImage = multer.diskStorage({
  destination: "tmp",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
export const uploadImage = multer({
  storage: storageImage,
  fileFilter: fileFilter,
});
