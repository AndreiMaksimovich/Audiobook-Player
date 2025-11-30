import {AudiobookManagerErrorCode, AudiobookProviderError, IAudiobookManager} from "./Types.API";
import {Audiobook, MediaFileType} from "shared";
import nodePath from "path";

export class AudiobookManagerHelper {

    constructor(private audiobookManager: IAudiobookManager) {}

    async getAudiobookIfExists(id: number): Promise<Audiobook | null> {
        try {
            return await this.audiobookManager.getAudiobook(id);
        }
        catch (error) {
            return null;
        }
    }

    getFileMediaType(filePath: string): MediaFileType {
        const {name, ext} = nodePath.parse(filePath)

        if (name == "icon") {
            return MediaFileType.Icon
        }

        switch (ext) {
            case ".png":
            case ".jpg":
            case ".jpeg":
                return MediaFileType.Image;
            case ".mp3":
            case ".aac":
                return MediaFileType.Audio;
        }
        throw new AudiobookProviderError(`Unknow media file type: ${filePath}`, AudiobookManagerErrorCode.UnknownMediaFileFormat)
    }
}
