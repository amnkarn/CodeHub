import fs from "fs/promises";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws.config.js";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";
import type { ArgumentsCamelCase } from "yargs";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

/*
    helper: read config.json
    Every command that touches S3 calls this first.
    Throws a clear error if user forgot to run `init` or hasn't linked a repoId.
*/
async function readConfig(): Promise<{ bucket: string; repoId: string }> {
    const configPath = path.resolve(process.cwd(), ".codeHub", "config.json");

    try {
        const raw = await fs.readFile(configPath, "utf-8");
        const config = JSON.parse(raw);

        if(!config.repoId) {
            throw new Error(
                "No repoId found in config.json.\n" +
                "Run: codehub init --repo <repoId>  (get the repoId from CodeHub after creating a repo)"
            );
        }

        return config;

    } catch (error: any) {
        if (error.code === "ENOENT") {
            throw new Error("No .codeHub folder found. Run `codehub init` first.");
        }
        throw error;
    }
}

/*
    Usage: codehub init --repo <repoId>
    user will get repoId after creating repository
*/
export async function init(argv: any) {
    const repoPath = path.resolve(process.cwd(), ".codeHub"); //hidden folder path
    const commitPaths = path.resolve(repoPath, "commits"); //subfolder

    try {
        //create both folders
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitPaths, { recursive: true });
        
        const repoId = argv.repo ?? null;

        // write config file
        const config = { 
            bucket: process.env.S3_BUCKET || "default-bucket",
            repoId: repoId
        };

        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify(config, null, 2),
        )

        if(repoId) {
            console.log(`Repository initialized successfully, and linked to remote repo: ${repoId}`);
        } else {
            console.log("Repository initialized.");
            console.log("No repoId set. Edit .codeHub/config.json and add your repoId before pushing.");
        }

    } catch (error) {
        console.log("Error in intialising the repository", error);
    }
}

export async function addRepo(argv: any) {
    const repoPath = path.resolve(process.cwd(), ".codeHub"); //.codeHub path
    const stagingPath = path.resolve(repoPath, "staging"); //staging dir
    try {
        //string from 'add <file>'
        const fileToStaging = argv.file; //hello.txt
        if(!fileToStaging) {
            throw new Error("No file path provided.");
        }

        const filePath = path.resolve(process.cwd(), fileToStaging); //absolute path

        const fileName = path.basename(filePath); //name of the file

        await fs.mkdir(stagingPath, { recursive: true }); //create staging dir
        const destPath = path.join(stagingPath, fileName); //destination path

        await fs.copyFile(filePath, destPath);
        console.log(`File ${fileName} added to the staging area`);

    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.error(`Error: The file "${argv.file}" does not exist.`);
        } else {
            console.error("Error adding file: ", error.message);
        }
    }
}

interface CommitArgs {
    message: string
}

export async function commitRepo(argv: ArgumentsCamelCase<CommitArgs>) {
    const repoPath = path.resolve(process.cwd(), ".codeHub");
    const stagedPath = path.resolve(repoPath, "staging");
    const commitPath = path.resolve(repoPath, "commits");

    try {
        let files = [];

        try {
            files = await fs.readdir(stagedPath);
        } catch {
            console.error("Nothing staged. Run `codehub add <file>` first.");
            return;
        }

        if(files.length === 0){
            console.error("Nothing staged. Run code add <files> first.");
            return;
        }

        const commitId = uuidv4();

        const commitDir = path.join(commitPath, commitId);
        await fs.mkdir(commitDir, { recursive: true });

        for(const file of files) {
            //copy in commit folder
            await fs.copyFile(
                //stagedPath = 'address', file = 'file name'
                path.join(stagedPath, file),
                path.join(commitDir, file)
            );
        }

        await fs.writeFile( //created commit.json
            path.join(commitDir, "commit.json"),
            JSON.stringify({ 
                commitId,
                message: argv.message,
                date: new Date().toISOString(),
                files: files.filter((f: any) => f !== "commit.json"), //list what was commited
            }, null, 2)
        )

        //clear staging after commit
        await fs.rm(stagedPath, {recursive: true, force: true});

        console.log(`commited: ${commitId}`);
        console.log(`Message: ${argv.message}`)

    } catch (error) {
        console.log("Error in commiting: ", error);
    }
}

export async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), ".codeHub");2
    const commitsPath = path.join(repoPath, "commits");

    try {
        const config = await readConfig();
        const repoId = config.repoId;

        const commitDirs = await fs.readdir(commitsPath);

        for(const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir);
            const files = await fs.readdir(commitPath);

            for(const file of files) {
                const filePath = path.join(commitPath, file);

                const fileContent = await fs.readFile(filePath);

                
                const parallelUploads3  = new Upload({
                    client: s3,
                    params: {
                        Bucket: S3_BUCKET,
                        Key: `repo/${repoId}/commits/${commitDir}/${file}`,
                        Body: fileContent,
                    }
                })

                await parallelUploads3.done();
                console.log(`Pushed: ${commitDir}/${file}`);
            }
        }

        console.log("All commits pushed to S3.");
        
    } catch (error) {
        console.log("Error pushing to s3: ", error);
    }
}

export async function pullRepo() {
    const repoPath = path.resolve(process.cwd(), ".codeHub");
    const S3Bucket = process.env.S3_BUCKET;

    const config = await readConfig();
    const repoId = config.repoId;

    try {
        // get list of all files from bucket
        const command = new ListObjectsV2Command({
            Bucket: S3Bucket,
            Prefix: `repo/${repoId}/commits/`,
        })

        const data = await s3.send(command);
        if(!data.Contents || data.Contents.length === 0) {
            console.log("No commits found in S3");
            return;
        }

        // loop on the list and download
        for(const file of data.Contents) {
            //console.log(file);
            const key = file.Key;
            if(!key) continue;

            const relativePath = key.replace(`repos/${repoId}`, "");
            const localFilePath = path.join(repoPath, relativePath);
            const localDir = path.dirname(localFilePath);

            await fs.mkdir(localDir, {recursive: true});

            const getCommand = new GetObjectCommand({
                Bucket: S3_BUCKET,
                Key: key,
            });

            const response = await s3.send(getCommand); //fetch actual file
            
            if(response.Body) {
                const byteArray = await response.Body.transformToByteArray();
                await fs.writeFile(localFilePath, Buffer.from(byteArray));
                console.log(`Pulled: ${key}`);
            }
        }

        console.log("All commits pulled from s3 successfully");

    } catch (error) {
        console.log("Error in pulling from s3: ", error);
    }
}

export async function revertRepo({commitId}: {commitId: string}) {
    const repoPath = path.resolve(process.cwd(), ".codeHub");
    const commitPath = path.join(repoPath, "commits", commitId);// '/.codeHub/commits/commitId'
    const checkoutDir = path.resolve(repoPath, "..");// '/Project/

    try {
        //check's does commit exists
        try {
            await fs.access(commitPath);
        } catch (error) {
            console.log(`Error: Commit ${commitId} not found.`)
        }

        const files = await fs.readdir(commitPath);

        for(const file of files) {
            const srcPath = path.join(commitPath, file);// '/.codeHub/commits/commitId/app.ts'
            const destPath = path.join(checkoutDir, file);// '/Project/app.ts

            await fs.cp(srcPath, destPath, { recursive: true });
        }

        console.log(`Commit ${commitId} reverted successfully.`);

    } catch (error) {
        console.log("Unable to revert: ", error);
    }
}