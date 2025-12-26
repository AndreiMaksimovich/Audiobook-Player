import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs/promises'
import path from 'path'
import {spawn} from 'child_process';
import { parseArgs } from 'node:util';


const appDir = '../../apps/audiobook-player-rn-app'
const buildDir = './builds'
const relativeBuildDir = '../../tools/build-mobile/builds'
const credentialsPath = '../../secrets/credentials/credentials-{profile}.json'

const argumentOptions = {
    profile: {
        type: 'string',
        default: 'development',
    },
    buildAndroid: {
        type: 'boolean',
        default: false,
        short: 'a'
    },
    buildIOS: {
        type: 'boolean',
        default: false,
        short: 'i'
    },
    installAndroid: {
        type: 'boolean',
        default: false,
        short: 'ia'
    },
    installIOS: {
        type: 'boolean',
        default: false,
        short: 'ii'
    }
}

const {configuration} = parseArgs({options: argumentOptions});

(async () => {
    console.log('Build', configuration)

    const buildName = getBuildFileName(configuration.profile)
    await fs.cp(credentialsPath.replace('{profile}', configuration.profile), path.join(appDir, 'credentials.json'))

    if (configuration.buildAndroid) {
        const fileName = `${buildName}.apk`
        const outputRelativePath = path.join(relativeBuildDir, fileName)

        await execute(`cd ${appDir} && PROFILE="${configuration.profile}" eas build --platform android --local --output ${outputRelativePath}`)

        if (configuration.buildAndroid) {
            const outputPath = path.join(buildDir, fileName)
            await execute(`./install-android.sh "${outputPath}"`)
        }
    }

    if (configuration.buildIOS) {
        const fileName = `${buildName}.ipa`
        const outputRelativePath = path.join(relativeBuildDir, fileName)

        await execute(`cd ${appDir} && PROFILE="${configuration.profile}" eas build --platform ios --local --output ${outputRelativePath}`)

        if (configuration.installIOS) {
            const outputPath = path.join(buildDir, fileName)
            await execute(`cfgutil --foreach install-app "${outputPath}"`)
        }
    }

    process.exit(0);
})()

function die(error) {
    console.error(error);
    process.exit(1)
}

function getBuildFileName(profile) {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const hours = now.getHours(); // 0-23
    const minutes = now.getMinutes(); // 0-59

    function formatTimePart(number) {
        return String(number).padStart(2, '0')
    }

    return `${profile}_${year}-${formatTimePart(month)}-${formatTimePart(day)}_${formatTimePart(hours)}-${formatTimePart(minutes)}`;
}

function execute(command) {
    return new Promise((resolve, reject) => {
        const childProcess = spawn(command, null, {shell: true});

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
                die(new Error(`Command "${command}" exited with code ${code}`))
            } else {
                resolve(code);
            }
        });
    });
}
