import { UploadedFile } from "express-fileupload"

const getFileMetaData = (file: UploadedFile) => {
  return { size: file.size, name: file.name }
}
export default {getFileMetaData};
