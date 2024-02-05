import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    let ext = file.originalname.split(".")[1];
    cb(null, file.fieldname + "-" + Date.now() + "." + ext);
  },
});

const upload = multer({ storage: storage });
export default upload;
