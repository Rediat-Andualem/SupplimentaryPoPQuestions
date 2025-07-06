module.exports = (upload) => {
  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "File size should not exceed 10MB." });
        }
        if (err.message === "Only zip files are allowed.") {
          return res.status(400).json({ message: err.message });
        }
        return res.status(400).json({ message: err.message || "File upload error." });
      }
      next();
    });
  };
};