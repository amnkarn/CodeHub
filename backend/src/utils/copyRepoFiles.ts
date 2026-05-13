import { CopyObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3 } from "../config/aws.config.js";


//create new repo for the fork
//if already exist then ask user
//coppy files from orogonalRepoId on S3
//paste in user's forked new directory
export default async function copyRepoFilesInS3(originalRepoId: string, forkedByUserId: string) {
    const prefix = `repos/${originalRepoId}/commits/`;
    const S3_BUCKET = process.env.S3_BUCKET;
    const forkedRepoId = `${originalRepoId}_${forkedByUserId}`

    //get all files from s3
    const listCommad = new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: prefix,
    })

    const listed = await s3.send(listCommad);

    if(!listed.Contents || listed.Contents?.length === 0){
        console.log("Original repo has no pushed commits to copy.");
        return;
    }

    for(const obj of listed.Contents) {
        if(!obj.Key) {
            continue;
        }

        const newKey = obj.Key.replace(
            `repos/${originalRepoId}/`, `repos/${originalRepoId}_${forkedByUserId}/`
        )

        const copyCommand = new CopyObjectCommand({
            Bucket: S3_BUCKET,
            CopySource: `${S3_BUCKET}/${obj.Key}`,
            Key: newKey,
        })

        await s3.send(copyCommand);
    }

    console.log("S3 fiels copied to forked path.");
    return forkedRepoId;
}