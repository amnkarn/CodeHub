import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import { commitRepo, init, pullRepo, pushRepo, revertRepo, addRepo } from "./controller/command.controller.js";


// command controller
yargs(hideBin(process.argv))
    .command('init', 'Initialise a new repository', {}, init)

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
        "revert <commitID>",
        "Revert to specific commit",
        (yargs) => {
            return yargs.positional("commitId", {
                describe: "Commit ID to revert to",
                type: "string"
            })
        },
        revertRepo
    )

    .demandCommand(1, "you need atleast one command")
    .help().argv;
