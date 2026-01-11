import dotenv from 'dotenv';
dotenv.config();
import {execute} from 'tools-shared'
import fs from'node:fs/promises'
import path from 'path';
import { parseArgs } from 'node:util';


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

const clientImageConfig = {
    name: 'audiobook-player-client',
    repository: 'amaxsoftware',
    dockerDirectory: './docker/client',
    distDirectory: './docker/client/dist'
}

const serverImageConfig = {
    name: 'audiobook-player-server',
    repository: 'amaxsoftware',
    dockerDirectory: './docker/server',
    distDirectory: './docker/server/dist'
}

const argumentOptions = {
    server: {
        type: 'boolean',
        short: 's',
        default: false,
    },
    client: {
        type: 'boolean',
        short: 'c',
        default: false,
    },
    files: {
        type: 'boolean',
        short: 'f',
        default: false,
    },
    database: {
        type: 'boolean',
        short: 'd',
        default: false,
    },
    serverImage: {
        type: 'boolean',
        default: false,
    },
    serverImageTag: {
        type: 'string',
        default: 'latest',
    },
    clientImage: {
        type: 'boolean',
        default: false,
    },
    clientImageTag: {
        type: 'string',
        default: 'latest',
    },
    profile: {
        type: 'string',
        short: 'p',
    },
    output: {
        type: 'string',
        short: 'o',
        default: '',
    },
    cleanup: {
        type: 'boolean',
        default: true,
    },
    pushImages: {
        type: 'boolean',
        default: false,
    },
    imagePlatforms: {
        type: 'string',
        default: 'linux/amd64,linux/arm64',
    }
}

const {values: configuration} = parseArgs({options: argumentOptions});

const serverEnvFilePath = path.join(secretsDir, `server-env--${configuration.profile}.ini`)

async function run(configuration) {
    await clearTmpDir()
    await clearDockerDistDirs()
    await createDistSubfolders(configuration)

    // Save configuration
    await fs.writeFile(path.join(tmpDir, 'config.json'), JSON.stringify(configuration, null, 2), 'utf8')

    // server
    if (configuration.server || configuration.serverImage) {
        const webPackConfigurationFile = configuration.profile === 'production' ? 'webpack.config.production.js' : 'webpack.config.js'
        await execute(`cd ${serverDir} && webpack --config ${webPackConfigurationFile}`)

        if (configuration.server) {
            await fs.cp(`${serverDir}/dist/`, tmpServerDir, {recursive: true})
            await fs.cp(serverEnvFilePath, path.join(tmpServerDir, '.env'))
        }

        if (configuration.serverImage) {
            await buildDockerImage(serverImageConfig, `${serverDir}/dist/`, configuration.serverImageTag)
        }
    }

    // client
    if (configuration.client || configuration.clientImage ) {
        await execute(`npm run clear-metro-cache --prefix ${clientDir}`) // Clear cache, yep, it is required
        await execute(`cd ${clientDir} && webpack `) // Pack the service worker
        await execute(`npm run export-web-${configuration.profile} --prefix ${clientDir}`) // Export the app

        if (configuration.client) {
            await fs.cp(`${clientDir}/dist/`, tmpClientDir, {recursive: true})
        }

        if (configuration.clientImage) {
            await buildDockerImage(clientImageConfig, `${clientDir}/dist/`, configuration.clientImageTag)
        }
    }

    // media files
    if (configuration.files) {
        await fs.cp(audiobookFileDir, tmpFilesDir, {recursive: true})
    }

    // database
    if (configuration.database) {
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
    if (configuration.server || configuration.client || configuration.files || configuration.database) {
        const outputZipFilePath = configuration.output ? path.resolve(configuration.output) : path.join(path.resolve(buildDir), `${getBuildFileName()}.zip`)
        await execute(`cd ${tmpDir} && zip -r ${outputZipFilePath} .`)
        console.log(`Build: ${outputZipFilePath}`)
    }

    if (configuration.cleanup) {
        await clearTmpDir()
        await clearDockerDistDirs()
    }

    process.exit(0)
}

run(configuration).catch(console.error)

async function buildDockerImage(config, distSrcDir, tag) {
    await fs.cp(distSrcDir, config.distDirectory, {recursive: true})
    await execute(`docker buildx build --platform ${configuration.imagePlatforms} -t ${config.name} ${config.dockerDirectory}`)
    await execute(`docker tag ${config.name}:${tag} ${config.repository}/${config.name}:${tag}`)
    if (configuration.pushImages) {
        await execute(`docker push ${config.repository}/${config.name}:${tag}`)
    }
}

async function clearDockerDistDirs() {
    for (const config of [serverImageConfig, clientImageConfig]) {
        const files = await fs.readdir(config.distDirectory);
        for (const file of files) {
            const filePath = path.join(config.distDirectory, file);
            await fs.rm(filePath, { recursive: true, force: true });
        }
    }
}

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
    if (config.client) {
        await fs.mkdir(tmpClientDir)
    }

    if (config.server) {
        await fs.mkdir(tmpServerDir)
    }

    if (config.database) {
        await fs.mkdir(tmpDatabaseDir)
    }

    if (config.files) {
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
