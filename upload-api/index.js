const expess = require('express')
const multer = require('multer')
const app = expess()
const port = process.env.PORT || 8881

const fileFilter = function (req, file, cb) {
  const allowTypes = ["image/jpeg", "image/png", "image/gif"]
  if (!allowTypes.includes(file.mimetype)) {
    const error = new Error("Wrong file type")
    error.code = "LIMIT_FILE_TYPES"
    return cb(error, false)

  }
  cb(null, true)
}
const MAX_SIZE = 1000 * 1024
const upload = multer({
  dest: './uploads',
  fileFilter,
  limits: {
    fileSize: MAX_SIZE
  }
})

app.get('/', (req, res) => {
  res.send('Hello Expres')
})
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    file: req.file
  });

})
app.use(function (err, req, res, next) {
  if (err.code === "LIMIT_FILE_TYPES") {
    res.status(422).json({
      error: "Only images are allowed"
    })
    return;
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(422).json({
      error: `Too large Max size is ${Math.round(MAX_SIZE/1024)}Kb`
    })
    return;
  }
})
app.listen(port, () => {
  console.log(`We alive on http://localhost:${port}`);

})