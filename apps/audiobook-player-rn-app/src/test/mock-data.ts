import {Audiobook} from 'shared'
import fs from 'fs'
import * as path from "node:path";

const mockDataDir = '__mock_data__';

function getMockDataFilePath(fileName: string) {
    return path.join(mockDataDir, fileName);
}

export function loadMockDataFile<T>(fileName: string): T {
    return JSON.parse(fs.readFileSync(getMockDataFilePath(fileName), 'utf8'));
}

export function getMockAudiobook(): Audiobook {
    return loadMockDataFile('audiobook.json');
}

export function getMockAudiobooks(): Audiobook[] {
    return loadMockDataFile('audiobooks.json');
}
