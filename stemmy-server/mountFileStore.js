const reflectmetadata = require('reflect-metadata')
const fs = require('fs')
const { exec } = require('child_process')
if (!fs.existsSync('./fileStore/mounted')) {
  exec(`gcsfuse --key-file ${process.env.PWD}/gcloudstoragecreds.json stemmyfilestore ./fileStore`, (error, out, stderror) => {
    if (error || stderror) {
      throw new Error(`fileStore failed to mount: ${error.message || stderror.message}`)
    }
    console.log(out)
  })
}