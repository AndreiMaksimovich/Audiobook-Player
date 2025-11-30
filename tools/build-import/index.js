import dotenv from 'dotenv';
dotenv.config();

import fs from'node:fs'
import path from 'path';
import util from 'util';
import {exec} from 'child_process';
const execAsync = util.promisify(exec);

const allowedDirs = process.env.ALLOWED_DIRS.split('|').map(dir => path.resolve(dir));
const clientDir = path.resolve(process.env.CLIENT_DIR);
const serverDir = path.resolve(process.env.SERVER_DIR);
const mediaFilesDir = path.resolve(process.env.MEDIA_FILES_DIR);


const tmpDir = path.resolve(process.env.TMP_DIR);
const tmpDirClient = path.join(tmpDir, 'client');
const tmpDirServer = path.join(tmpDir, 'server');
const tmpDirMediaFiles = path.join(tmpDir, 'files');
const tmpDirDatabase = path.join(tmpDir, 'database');

const launchServer = process.env.LAUNCH_SERVER === 'true';
const pm2AppName = process.env.PM2_APP_NAME;

const buildPath = process.argv[process.argv.length - 1];

if (!fs.existsSync(buildPath)) {
    die("File not exist", buildPath);
}

if (path.extname(buildPath) !== '.zip') {
    die("extension != zip", buildPath);
}

run().catch(console.error).finally(exit);

async function run() {

    // clear tmp dir
    await clearDir(tmpDir)

    // unzip build
    await execAsync(`unzip ${buildPath} -d ${tmpDir}`)

    // client
    if (fs.existsSync(tmpDirClient)) {
        await clearDir(clientDir)
        await copyFiles(tmpDirClient, clientDir)
    }

    // server
    if (fs.existsSync(tmpDirServer)) {
        if (launchServer) {
            await execAsync(`pm2 stop ${pm2AppName} || true`)
        }
        await clearDir(serverDir)
        await copyFiles(tmpDirServer, serverDir)
        if (launchServer) {
            await execAsync(`cd ${serverDir} && pm2 start index.js --name ${pm2AppName}`)
        }
    }

    // media files
    if (fs.existsSync(tmpDirMediaFiles)) {
        await clearDir(mediaFilesDir)
        await copyFiles(tmpDirMediaFiles, mediaFilesDir)
    }

    // database
    const databaseDumpPath = path.join(tmpDirDatabase, 'database.sql');
    if (fs.existsSync(databaseDumpPath)) {
        await execAsync(`mysql --defaults-extra-file=${process.env.MYSQL_CONFIG_FILE} audiobooks < ${databaseDumpPath}`)
    }

    // cleanup
    await clearDir(tmpDir)
}

function die(...args) {
    console.error(args)
    process.exit(1)
}

function exit() {
    process.exit(0)
}

function isDirAllowed(dirPath) {
    const absolutePath = path.resolve(dirPath);
    for (const allowedPath of allowedDirs) {
        if (dirPath.startsWith(allowedPath)) {
            return true;
        }
    }
    return false
}

async function clearDir(dirPath) {
    if (!isDirAllowed(dirPath)) {
        die("Directory is not allowed", dirPath)
    }
    await execAsync(`rm -rf ${dirPath}/*`)
}

async function copyFiles(dirSrc, dirDst) {
    await execAsync(`cd ${dirSrc} && cp -R . ${dirDst}`)
}
