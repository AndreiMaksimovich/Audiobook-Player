import {AudiobookImporterExcel} from "../src/importer/AudiobookImporterExcel";
import {audiobookManager} from "../src/core";

const importer = new AudiobookImporterExcel(
    audiobookManager,
    '../../import/audiobooks.xlsx',
    '../../import/files'
)

async function run() {
    try {
        await importer.import()
    } catch (e) {
        console.error(e);
    }

    process.exit(0);
}

run();
