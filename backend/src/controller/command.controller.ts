import fs from "fs/promises";
import path from "path";

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

export function commitRepo() {
    console.log("add repo command called")
}

export function pushRepo() {
    console.log("add repo command called")
}

export function pullRepo() {
    console.log("add repo command called")
}

export function revertRepo() {
    console.log("add repo command called")
}