import { parseArgs } from 'node:util';
import fs from 'fs';
import path from "path";
import {spawn} from "child_process";

const dockerComposeRoot = path.resolve('./audiobook_player')
const clientDir = path.join(dockerComposeRoot, 'client/dist');
const serverDir = path.join(dockerComposeRoot, 'server/dist');
const mediaFilesDir = path.join(dockerComposeRoot, 'files/audiobook-files');
const initDatabaseDir = path.join(dockerComposeRoot, 'mysql-init');

const rootDir = path.resolve('./')
const tmpDir = path.resolve("./tmp");
const tmpDirClient = path.join(tmpDir, 'client');
const tmpDirServer = path.join(tmpDir, 'server');
const tmpDirFiles = path.join(tmpDir, 'files');
const tmpDirDatabase = path.join(tmpDir, 'database');


const argumentOptions = {
    path: {
        type: 'string',
        required: true,
    },
    cleanup: {
        type: 'boolean',
        default: true,
    }
}

const {values: configuration} = parseArgs({options: argumentOptions});

if (!fs.existsSync(configuration.path)) {
    die("File not exist", configuration.path);
}

(async () => {

    // clear tmp dir
    await clearDir(tmpDir)

    // unzip build
    await execute(`unzip ${configuration.path} -d ${tmpDir}`)

    // client
    if (fs.existsSync(tmpDirClient)) {
        await clearDir(clientDir)
        await copyFiles(tmpDirClient, clientDir)
    }

    // server
    if (fs.existsSync(tmpDirServer)) {
        await clearDir(serverDir)
        await copyFiles(tmpDirServer, serverDir)
    }

    // files
    if (fs.existsSync(tmpDirFiles)) {
        await clearDir(mediaFilesDir)
        await copyFiles(tmpDirFiles, mediaFilesDir)
    }

    // database
    if (fs.existsSync(tmpDirDatabase)) {
        await clearDir(initDatabaseDir)
        await copyFile(path.join(tmpDirDatabase,'database.sql'), path.join(initDatabaseDir,'audiobooks.sql'))
    }

    // Run docker compose
    await execute(`cd ${dockerComposeRoot} && docker-compose up -d --build`)

    // clear tmp dir
    if (configuration.cleanup) {
        await clearDir(tmpDir)
    }
})().catch(error => die(error)).finally(() => process.exit(0));

function die(error) {
    console.error(error);
    process.exit(1)
}

function isDirAllowed(dirPath) {
    // Sanity check
    const absolutePath = path.resolve(dirPath)
    return absolutePath.startsWith(rootDir)
}

async function clearDir(dirPath) {
    if (!isDirAllowed(dirPath)) {
        die("Directory is not allowed", dirPath)
    }
    await execute(`rm -rf ${dirPath}/*`)
}

async function copyFiles(dirSrc, dirDst) {
    if (!isDirAllowed(dirSrc)) {
        die("Directory is not allowed", dirSrc)
    }
    if (!isDirAllowed(dirDst)) {
        die("Directory is not allowed", dirDst)
    }
    await execute(`cd ${dirSrc} && cp -R . ${dirDst}`)
}

async function copyFile(srcPath, dstPath) {
    if (!isDirAllowed(srcPath)) {
        die("File is not allowed", srcPath)
    }
    if (!isDirAllowed(dstPath)) {
        die("File is not allowed", dstPath)
    }
    await execute(`cp ${srcPath} ${dstPath}`)
}

export function execute(command) {
    return new Promise((resolve, reject) => {
        const childProcess = spawn(command, undefined, {shell: true});

        childProcess.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        childProcess.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        childProcess.on('error', (err) => {
            reject(err.toString());
        });

        childProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Command "${command}" exited with code ${code}`))
            } else {
                resolve(0);
            }
        });
    });
}
