const {S3} = require("aws-sdk")
const uuid = require("uuid").v4
 

exports.s3UploadV2 = async(file)=>{
    console.log(process.env, "==== ENV ===")
    console.log(process.env.AWS_BUCKET_NAME, "=== bucket name ===")

    const s3 = new S3()

    const param = {
        
        Bucket : "bulkimage-node-bucket",
        Key : `uploads/${uuid()}-${file.originalname}`,
        Body : file.buffer
    }

    let result = await s3.upload(param).promise()
    return result
}