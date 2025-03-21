import { diskStorage } from 'multer';
import * as path from 'path';

export const storage = diskStorage({
  destination: 'uploads',
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

function generateFilename(file) {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  return `${randomName}${path.extname(file.originalname)}`;
}
