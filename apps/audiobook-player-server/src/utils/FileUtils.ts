import crypto from "node:crypto";
import fs from "fs";
import nodePath from "path";
import Ffmpeg from "fluent-ffmpeg";
import * as fsPromises from "fs/promises";

export async function calculateFileHash(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(process.env.HASH_ALGORITHM ?? "sha256");
        const stream = fs.createReadStream(path);
        stream.on('error', err => reject(err));
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => {
            resolve(hash.digest('hex'));
            stream.close();
        });
    });
}

export async function getFileSize(filePath: string): Promise<number> {
    return (await fsPromises.stat(filePath)).size
}

export async function getAudioFileDuration(filePath: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        try {
            Ffmpeg.ffprobe(filePath, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const duration = Math.round(data.format.duration! * 1000);
                    resolve(duration);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function getFileMimeType(filePath: string): string {
    const extension = nodePath.extname(filePath);
    switch (extension) {
        case ".png":
            return MimeType.ImagePNG;
        case ".jpg":
        case ".jpeg":
            return MimeType.ImageJPG;
        case ".mp3":
            return MimeType.AudioMP3;
        case ".aac":
            return MimeType.AudioAAC;
    }
    throw new Error(`Unknow file format: ${filePath}`)
}

export enum MimeType {
    ImageJPG = "image/jpeg",
    ImagePNG = "image/png",
    AudioMP3 = "audio/mpeg",
    AudioAAC = "audio/aac"
}
