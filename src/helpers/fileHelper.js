const fs = require("fs");
const path = require("path");

const buildPublicUrl = (req, filename) =>
  `${req.protocol}://${req.get("host")}/uploads/posts/${filename}`;

const deleteFileFromUrl = (url) => {
  if (!url) return;
  try {
    const pathname = new URL(url).pathname;
    const filename = path.basename(pathname);
    const filePath = path.join(__dirname, "../../uploads/posts", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // URL relativa o mal formada: intentar extraer el nombre del archivo
    const filename = path.basename(url);
    const filePath = path.join(__dirname, "../../uploads/posts", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

module.exports = { buildPublicUrl, deleteFileFromUrl };
