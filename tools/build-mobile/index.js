import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs/promises'
import path from 'path'
import {spawn} from 'child_process';


const appDir = '../../apps/audiobook-player-rn-app'
const buildDir = './builds'
const relativeBuildDir = '../../tools/build-mobile/builds'
const credentialsPath = '../../secrets/credentials/credentials-{profile}.json'

const configuration = {
    buildAndroid: false,
    buildIOS: false,
    profile: "preview",
    installAndroid: false,
    installIOS: false,
}

const supportedProfiles = ["preview", "production", "development"];

for (let i=0; i<process.argv.length; i++) {
    const arg = process.argv[i];

    // Profile
    if (arg === '--profile') {
        if (i === process.argv.length - 1) {
            die('Profile value argument is required');
        }
        i += 1
        const value = process.argv[i];
        if (value.startsWith('--')) {
            die('Profile value is required');
        }
        configuration.profile = value;
        continue;
    }

    // Android
    if (arg === '--android') {
        configuration.buildAndroid = true;
        continue
    }

    // Install Android
    if (arg === '--installAndroid') {
        configuration.installAndroid = true;
        continue
    }

    // iOS
    if (arg === '--ios') {
        configuration.buildIOS = true;
        continue
    }

    // Install iOS
    if (arg === '--installIOS') {
        configuration.installIOS = true;
        continue
    }
}

if (configuration.buildAndroid === false && configuration.buildIOS === false) {
    die('arguments --android or/and --ios are required')
}

if (supportedProfiles.indexOf(configuration.profile) === -1) {
    die(`Unknow profile ${configuration.profile}`);
}

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

        if (configuration.buildIOS) {
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
