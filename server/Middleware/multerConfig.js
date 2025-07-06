const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const zipFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["application/zip", "application/x-zip-compressed"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedMimeTypes.includes(file.mimetype) || ext === ".zip") {
    cb(null, true);
  } else {
    cb(new Error("Only zip files are allowed."), false);
  }
};

const limits = { fileSize: 10 * 1024 * 1024 }; // 10MB

const questionAnswerUpload = (() => {
  const questionFolder = path.join(__dirname, "../STORE/QuestionStore");
  const answerFolder = path.join(__dirname, "../STORE/AnswerStore");
  ensureFolder(questionFolder);
  ensureFolder(answerFolder);

  const storage = multer.diskStorage({


destination: (req, file, cb) => {
  if (file.fieldname === "questionReferenceLink") {
    cb(null, questionFolder);
  } else if (file.fieldname === "AnswerReferenceLink") {
    cb(null, answerFolder);
  } else {
    cb(new Error("Invalid field name for file upload."), null);
  }
}

    
    ,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  return multer({
    storage,
    fileFilter: zipFileFilter,
    limits
  }).fields([
    { name: "questionReferenceLink", maxCount: 1 },
    { name: "AnswerReferenceLink", maxCount: 1 },
  ]);
})();

module.exports = { questionAnswerUpload };
