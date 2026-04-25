import { S3Client } from "@aws-sdk/client-s3"

const S3_BUCKET = "codehub-876163988927-us-east-1-an";

const s3 = new S3Client ({
    region: "ap-south-1"
})

export {
    s3,
    S3_BUCKET
}