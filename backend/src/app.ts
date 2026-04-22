import express, { type Application } from "express";
import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import { init } from "./controller/command.controller.js";
import { addRepo } from "./controller/command.controller.js";

const app: Application = express();
app.use(express.json());

// command controller
yargs(hideBin(process.argv))
    .command('init', 'Initialise a new repository', {}, init)
    .command(
        'add <file>', 
        'Add a file to repository', 
        (yargs) => {
            yargs.positional("file", {
                describe: "File to add to the staging area",
                type: "string"
            })
        },
        addRepo
    )
    .demandCommand(1, "you need atleast one command")
    .help().argv;


app.get("/", (req, res) => {
    res.send("hii");
})



export default app;