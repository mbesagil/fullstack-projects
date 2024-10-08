const upload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid"); // UUID oluşturmak için uuid modülünü ekleyin

const uploadFolderPath = path.join(__dirname, "../..", "uploads");

console.log("uploadFolderPath:>> ", uploadFolderPath);

function fixUtf8TurkishCharacters(text) {
  const characterMap = {
    "Ã¶": "ö",
    "Ã‡": "Ç",
    ÄŸ: "ğ",
    "Ä±": "ı",
    "Ã¼": "ü", // 'Ã¼' karakteri 'ü' karakterine dönüştürüldü
    ÅŸ: "ş",
    "Ã–": "Ö",
    "Ã‡": "Ç",
    Äž: "Ğ",
    "Ä°": "İ",
    Ãœ: "Ü", // 'Ãœ' karakteri 'Ü' karakterine dönüştürüldü
    Åž: "Ş",
  };

  return text.replace(
    /Ã¶|Ã‡|ÄŸ|Ä±|Ã¼|ÅŸ|Ã–|Ã‡|Äž|Ä°|Ãœ|ÅŞ/g,
    (matched) => characterMap[matched] || matched
  );
}
const uploadFile = async (req, res) => {
  try {
    console.log("reg :>> ", req.files);
    if (req.files) {
      if (!req.user) {
        return res.status(404).send({ message: "Firts Login" });
      }

      const userPath = path.join(uploadFolderPath, req.user.id);

      console.log("userPath :>> ", userPath);
      // Klasörün varlığını kontrol edin, eğer yoksa oluşturun
      if (!fs.existsSync(userPath)) {
        fs.mkdirSync(userPath, { recursive: true });
      }

      const file = req.files.file;
      console.log("file :>> ", file);
      const filename = file.name; // standart harflere cevirme
      const clearFilename = fixUtf8TurkishCharacters(file.name);
      console.log("clearFilename :>> ", clearFilename);
      let uzanti = "";
      const mimeType = file.mimetype;
      const fileSize = file.size / (1024 * 1024);
      const guid = uuidv4(); // Rastgele bir GUID oluştur
      console.log("name = " + filename);
      console.log("type = " + mimeType);
      console.log("size = " + fileSize);

      // Sharp kütüphanesi kullanarak görüntüyü yeniden boyutlandırın
      const resizedImages = [];
      const resizeOptions = [1, 0.25]; // %100, %50

      // "ikonik.png" dosyasını yükle
      const watermark = fs.readFileSync("watermark/bikonik.png");
      console.log("watermark :>> ", watermark);

      res.setHeader("Access-Control-Allow-Origin", "*"); // CORS başlığını ekleyin

      const sonNoktaIndeksi = filename.lastIndexOf(".");
      if (sonNoktaIndeksi !== -1) {
        // Dosya adını ve uzantıyı bölelim
        uzanti = filename.substring(sonNoktaIndeksi + 1);
        console.log("Uzantı: ", uzanti);
      }

      if (
        mimeType.endsWith("png") ||
        mimeType.endsWith("jpg") ||
        mimeType.endsWith("jpeg")
      ) {
        sharp(file.data)
          .metadata()
          .then((metadata) => {
            // Orijinal görüntüyü kaydet

            fs.writeFileSync(
              `${uploadFolderPath}/${req.user.id}/${guid}.${uzanti}`,
              file.data,
              "base64"
            );
            res.send({ data: { id: guid, name: filename, uzanti: uzanti } });
            console.log(`ID : ${guid}`);
          })
          .catch((err) => {
            console.error("Error getting image metadata: ", err);
            res.send("Error getting image metadata.");
          });
      } else if (
        mimeType.endsWith("pdf") ||
        mimeType.endsWith("document") ||
        mimeType.endsWith("sheet")
      ) {
        const file = req.files.file;
        // Dosya içeriğini inceleme ve zararlı içerikleri tespit etme
        if (
          file.data.includes("eval(") ||
          file.data.includes("require(") ||
          file.data.includes("exec(")
        ) {
          // Eğer zararlı içerik varsa, dosya yüklemeyi reddedin
          res.status(400).send("Bu dosya kabul edilemez");
        } else {
          // Eğer zararlı içerik yoksa orijinal dosyayı ve Base64 kodlanmış dosyayı kaydet
          // fs.writeFileSync("./uploads/" + originalFifleName, file.data);

          if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "Hiçbir dosya seçilmedi." });
          }

          console.log(
            "${uploadFolderPath}/${guid}.${uzanti} :>> ",
            `${uploadFolderPath}/${guid}.${uzanti}`
          );

          // Dosyayı istediğiniz bir klasöre kaydedin
          file.mv(
            `${uploadFolderPath}/${req.user.id}/${guid}.${uzanti}`,
            (err) => {
              if (err) {
                return res
                  .status(500)
                  .json({ message: "Dosyayı kaydederken hata oluştu." });
              }

              res.send({ data: { id: guid, name: filename, uzanti: uzanti } });
            }
          );
        }
      }
    } else {
      res.send("No image was uploaded.");
    }
  } catch (error) {
    return res.status(404).send({ error: error });
  }
};

const getFile = async (req, res) => {


  const { file } = req.params;
  const filePath = path.join(uploadFolderPath, req.user.id, file);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send({ message: "Data Not Found" });
  }

  const readFileData = fs.readFileSync(filePath);
  const extension = path.extname(filePath).toLowerCase();
  let mimeType;

  switch (extension) {
    case ".pdf":
      mimeType = "application/pdf";
      break;
    case ".jpg":
    case ".jpeg":
    case ".png":
      mimeType = `image/${extension.slice(1)}`;
      break;
    case ".doc":
    case ".docx":
      mimeType = "application/msword";
      break;
    case ".xls":
    case ".xlsx":
      mimeType = "application/vnd.ms-excel";
      break;
    default:
      mimeType = "application/octet-stream";
      break;
  }

  let data = Buffer.from(readFileData).toString("base64");

  if (data) {
    res.setHeader("Content-Disposition", "inline");
    return res
      .status(200)
      .send({ data: `data:${mimeType};base64,${data}`, type: `${mimeType}` });
  } else {
    return res.status(500).send({ file: "Error file" });
  }
};

const deleteFile = (req, res) => {
  const file = req.params.file; // İstenen görüntü ID'sini alın

  // İlgili ID'ye sahip tüm dosyaları silin

  fs.unlink(`${uploadFolderPath}/${req.user.id}/${file}`, (err) => {
    if (err) {
      console.error("Error not delete: ", err);
      return res.status(500).send({ message: "Error not delete" });
    } else {
      return res.status(200).send({ message: `${file} deleted` });
      console.log("File deleted.");
    }
  });

  //   fs.readdir(fileDirectory, (err, files) => {
  //     if (err) {
  //       console.error("Error reading directory:", err);
  //       res.status(500).send("Error reading directory");
  //     } else {
  //       files.forEach((file) => {
  //         if (file.startsWith(imageId)) {
  //           fs.unlink(path.join(fileDirectory, file), (err) => {
  //             if (err) {
  //               console.error(`Error deleting file ${file}:`, err);
  //             }
  //           });
  //         }
  //         // if (file.startsWith("k" + imageId)) {
  //         //   fs.unlink(path.join(fileDirectory, file), (err) => {
  //         //     if (err) {
  //         //       console.error(`Error deleting file ${file}:`, err);
  //         //     }
  //         //   });
  //         // }

  //         // if (file.startsWith("b" + imageId)) {
  //         //   fs.unlink(path.join(fileDirectory, file), (err) => {
  //         //     if (err) {
  //         //       console.error(`Error deleting file ${file}:`, err);
  //         //     }
  //         //   });
  //         // }
  //       });
  //       // Örneğin, veritabanından ilgili kaydı silebilirsiniz

  //       // İşlem başarılı ise yanıt gönderin
  //       res.send(imageId);
  //     }
  // });
};

const downloadFile = (req, res) => {
  const { file } = req.params;
  const filePath = path.join(uploadFolderPath, req.user.id, file);

  console.log("filePath :>> ", filePath);
  // Check if the file exists

  if (fs.existsSync(filePath)) {
    // Provide the file for download

    const fileData = fs.readFileSync(filePath);

    // Dosyayı base64'e dönüştür
    const base64Data = fileData.toString("base64");

    res.json({ base64Data });

    // res.download(filePath, (err) => {
    //   if (err) {
    //     // Handle any errors that may occur during download
    //     console.error("Error while downloading file:", err);
    //     res.status(500).send("Error while downloading file");
    //   }
    // });
  } else {
    res.status(404).send("File not found");
  }
};

module.exports = {
  uploadFile,
  getFile,
  deleteFile,
  downloadFile,
};
