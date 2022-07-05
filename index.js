const express = require("express")
const app = express()
const multer = require("multer")
const { s3UploadV2 } = require("./s3Service")
const uuid = require("uuid").v4
require("dotenv").config({path:"./.env"})
let fileName

// const storage = multer.diskStorage({
//     destination : (req,file,cb) =>{
//         cb(null, 'uploads')
//     },
//     filename : (req,file,cb)=>{
//         const {originalname} = file
//         fileName = `${uuid()}-${originalname}`
//         cb(null,fileName)
//     }
// })

const storage = multer.memoryStorage()

const fileFilter = (req,file,cb) =>{
    if(file.mimetype.split("/")[0] == "image"){
        cb(null,true)
    }
    else{
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
    }
}

const upload = multer({storage, fileFilter})

app.post("/uploadMultiple", upload.array("file"),async (req,res,next)=>{

    //console.log(req, "req body")
    const file = req.files[0]
    const result = await s3UploadV2(file)
    res.json({
        status : "Success",result
    })
})

app.use((error,req,res,next)=>{
    console.log("came inside error")
    console.log(error)
    if(error instanceof multer.MulterError){
        if(error.code === "LIMIT_UNEXPECTED_FILE"){
            return res.status(400).json({
                status : "failed",
                message : "Invalid file type. Please upload a file of image type"
            })
        }
    }
    else{
        console.log("else")
    }
})

const PORT = 5000
app.listen(PORT, ()=>{
    console.log(`Server started on ${PORT}`)
})