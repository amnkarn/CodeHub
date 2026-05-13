import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import { commitRepo, init, pullRepo, pushRepo, revertRepo, addRepo } from "./controller/command.controller.js";

interface revertArgs {
    commitId: string
}

// command controller
yargs(hideBin(process.argv))
    //.command('start', "start new server", {}, start)

    .command(
        'init', 
        'Initialise a new repository',
        (yargs) => {
            return yargs.option("repo", {
                describe: "Repository ID from CodeHub (get this after creating a repo on the site)",
                type: "string"
            })
        },
        init
    )

    .command('push', 'Push commits to CodeHub', {}, pushRepo)

    .command('pull', 'Pull commits from CodeHub', {}, pullRepo)

    .command(
        'add <file>',
        'Add a file to repository',
        (yargs) => {
            return yargs.positional("file", {
                describe: "File to add to the staging area",
                type: "string"
            })
        },
        addRepo
    )

    .command(
        "commit <message>",
        "Commit the staged file",
        (yargs) => {
            return yargs.positional("message", {
                describe: "Commit message",
                type: "string"
            })
        },
        commitRepo
    )

    .command(
        "revert <commitId>",
        "Revert to specific commit",
        (yargs) => {
            return yargs.positional("commitId", {
                describe: "Commit ID to revert to",
                type: "string"
            })
        },
        (handlerArgs) => {
            console.log("DEBUG - Received Args:", handlerArgs);
            const { commitId } = handlerArgs;
            console.log(commitId)

            if (!commitId || typeof commitId !== 'string') {
                console.error("Please provide a valid Commit ID.");
                return;
            }

            revertRepo(handlerArgs as revertArgs);
        }
    )

    .demandCommand(1, "you need atleast one command")
    .help().argv;


//function start() {
//    console.log('server called')
//}