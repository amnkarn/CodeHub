import 'dotenv/config'
import { S3Client } from "@aws-sdk/client-s3"

const S3_BUCKET = "codehub-876163988927-us-east-1-an";

const accessKey = process.env.AWS_ACCESS_KEY!;
const secretKey = process.env.AWS_SECRET_KEY!;

const s3 = new S3Client ({
    region: "us-east-1",
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
    }
})

export {
    s3,
    S3_BUCKET
}