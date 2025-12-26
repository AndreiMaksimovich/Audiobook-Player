import dotenv from 'dotenv';
dotenv.config();
import {execute} from 'tools-shared'
import fs from'node:fs/promises'
import path from 'path';


const serverDir = '../../apps/audiobook-player-server'
const clientDir = '../../apps/audiobook-player-rn-app'
const audiobookFileDir = '../../audiobook-files'
const secretsDir = '../../secrets'

const buildDir = './builds'

const tmpDir = './tmp'
const tmpServerDir = path.join(tmpDir, 'server')
const tmpClientDir = path.join(tmpDir, 'client')
const tmpDatabaseDir = path.join(tmpDir, 'database')
const tmpFilesDir = path.join(tmpDir, 'files')

const configuration = {
    addDatabase: argsContainKey('database'),
    addFiles: argsContainKey('files'),
    addServer: argsContainKey('server'),
    addClient: argsContainKey('client'),
    production: argsContainKey('production'),
}

const debug = argsContainKey('debug')

const serverEnvFilePath = path.join(secretsDir, `server-env--${configuration.production ? 'production' : 'preview'}.ini`)

async function run(configuration) {
    await clearTmpDir()
    await createDistSubfolders(configuration)

    // Save configuration
    await fs.writeFile(path.join(tmpDir, 'config.json'), JSON.stringify(configuration, null, 2), 'utf8')

    // server
    if (configuration.addServer) {
        await execute(`cd ${serverDir} && webpack `) // "Pack" server into a single standalone file
        await fs.cp(`${serverDir}/dist/`, tmpServerDir, {recursive: true})
        await fs.cp(serverEnvFilePath, path.join(tmpServerDir, '.env'))
    }

    // client
    if (configuration.addClient) {
        await execute(`cd ${clientDir} && webpack `) // "Pack" service worker
        await execute(`npm run export-web-${configuration.production ? 'production' : 'preview'} --prefix ${clientDir}`)
        await fs.cp(`${clientDir}/dist/`, tmpClientDir, {recursive: true})
    }

    // media files
    if (configuration.addFiles) {
        await fs.cp(audiobookFileDir, tmpFilesDir, {recursive: true})
    }

    // database
    if (configuration.addDatabase) {
        const sqlFilePath = `${tmpDatabaseDir}/database.sql`
        await execute(`mysqldump --defaults-extra-file=${secretsDir}/mysql-config--local.ini --skip-lock-tables --routines --add-drop-table --disable-keys --set-gtid-purged=COMMENTED --extended-insert audiobooks  > ${sqlFilePath}`)
        const sql = await fs.readFile(sqlFilePath, { encoding: 'utf8' })
        const sqlToSave =
            sql
                .replace('SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;', '/* SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN; */')
                .replace('SET @@SESSION.SQL_LOG_BIN= 0;', '/* SET @@SESSION.SQL_LOG_BIN= 0; */')
                .replace('SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;', '/* SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN; */')
        await fs.writeFile(sqlFilePath, sqlToSave, { encoding: 'utf8' })
    }

    // zip build
    await execute(`cd ${tmpDir} && zip -r ${path.join(path.resolve(buildDir), `${getBuildFileName()}.zip`)} .`)

    if (!debug) {
        await clearTmpDir()
    }

    process.exit(0)
}

run(configuration)

async function clearTmpDir() {
    try {
        const files = await fs.readdir(tmpDir);
        for (const file of files) {
            const filePath = path.join(tmpDir, file);
            await fs.rm(filePath, { recursive: true, force: true });
        }
    } catch (err) {
        console.error(`Error emptying directory "${tmpDir}":`, err);
    }
}

async function createDistSubfolders(config) {
    if (config.addClient) {
        await fs.mkdir(tmpClientDir)
    }

    if (config.addServer) {
        await fs.mkdir(tmpServerDir)
    }

    if (config.addDatabase) {
        await fs.mkdir(tmpDatabaseDir)
    }

    if (config.addFiles) {
        await fs.mkdir(tmpFilesDir)
    }
}

function getBuildFileName() {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const hours = now.getHours(); // 0-23
    const minutes = now.getMinutes(); // 0-59

    function formatTimePart(number) {
        return String(number).padStart(2, '0')
    }

    return `audiobooks__${year}-${formatTimePart(month)}-${formatTimePart(day)}_${formatTimePart(hours)}-${formatTimePart(minutes)}`;
}

function argsContainKey(key) {
    return process.argv.includes(key)
}
