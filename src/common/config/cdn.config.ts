import axios from 'axios';
import * as fs from 'fs';

export const handleUploadFileToCdn = async (
  file: Express.Multer.File,
  fileName: string,
) => {
  const fileStream = fs.createReadStream(file.path);
  try {
    const res = await axios.put(
      `https://storage.bunnycdn.com/playable-factory/${fileName}`,
      fileStream,
      {
        headers: {
          AccessKey: 'db38e5b4-17cf-4827-adb595d15b96-d67f-46f8',
        },
      },
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUploadFilesToCdn = async (
  files: Express.Multer.File[],
  filesName: string[],
) => {
  try {
    const mappedFiles = files.map(
      async (file: Express.Multer.File, index: number) => {
        const fileStream = fs.createReadStream(file.path);

        const res = await axios.put(
          `${process.env.BUNNY_CDN_STORAGE_URL}/${process.env.BUNNY_CDN_USERNAME}/${filesName[index]}`,
          fileStream,
          {
            headers: {
              AccessKey: 'db38e5b4-17cf-4827-adb595d15b96-d67f-46f8',
            },
          },
        );
        console.log(res.data);
      },
    );

    return await Promise.all(mappedFiles);
  } catch (error) {
    console.log(error);
  }
};
