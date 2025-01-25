function extractFileInformation(fileData, uploadData) {
  const url = filterFileName(uploadData.path); // Extracts Supabase stored file name
  const fileName = fileData.originalname;
  const fileSize = fileData.size;
  const fileType = fileData.mimetype;
  return { url, fileName, fileSize, fileType };
}

function filterFileName(fullFilePath) {
  const url = fullFilePath.split("/").slice(-1)[0];
  return url;
}

module.exports = extractFileInformation;
