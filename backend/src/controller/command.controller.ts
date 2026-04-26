import fs from "fs/promises";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws.config.js";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";
import type { ArgumentsCamelCase } from "yargs";

//import { exec } from "child_process";
//import { promisify } from "util";
//const execPromise = promisify(exec);


export async function init() {
    const repoPath = path.resolve(process.cwd(), ".codeHub"); //hidden folder
    const commitPaths = path.resolve(repoPath, "commits"); //subfolder

    try {
        //create folders
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitPaths, { recursive: true });
        
        // write config file
        const config = { bucket: process.env.S3_BUCKET || "default-bucket" };
        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify(config, null, 2),
        )

        //if (process.platform === "win32") { //hide .codeHub folder
        //    await execPromise(`attrib +h "${repoPath}"`);
        //}

        console.log("Repository initialized successfully at .codeHub");

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

        const filePath = path.resolve(process.cwd(), fileToStaging); //absolute path of src file

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
        const commitId = uuidv4();

        const commitDir = path.join(commitPath, commitId);
        await fs.mkdir(commitDir, { recursive: true }); //created dir with the commitId

        const files = await fs.readdir(stagedPath); //read all staged file
        for(const file of files) {
            await fs.copyFile( //copy in commit folder
                //stagedPath = 'address', file = 'file name'
                path.join(stagedPath, file),
                path.join(commitDir, file)
            );
        }

        const commitMsg = argv.message;
        //console.log(commitMsg);
        await fs.writeFile( //created commit.json
            path.join(commitDir, "commit.json"),
            JSON.stringify({ commitMsg, date: new Date().toISOString() })
        )

    } catch (error) {
        console.log("Error in commiting: ", error);
    }
}

export async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), ".codeHub");
    const commitsPath = path.join(repoPath, "commits");

    try {
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
                        Key: `commits/${commitDir}/${file}`,
                        Body: fileContent,
                    }
                })

                await parallelUploads3.done();
            }
        }
        console.log("All commits pushed to S3.");
        
    } catch (error) {
        console.log("Error pushing to s3: ", error);
    }
}

export function pullRepo() {
    console.log("add repo command called")
}

export function revertRepo() {
    console.log("add repo command called")
}