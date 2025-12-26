import {spawn} from "child_process";

export function execute(command: string): Promise<number> {
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
