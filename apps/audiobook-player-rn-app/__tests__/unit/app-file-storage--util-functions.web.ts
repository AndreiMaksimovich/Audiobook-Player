import {pathJoin, pathName, pathParse} from '@/src/lib/app-file-storage/AppFileStorage.web'

// ---- pathJoin
describe('AppFileStorage.web.pathJoin', () => {

    it('some/ + name/ + file.txt = some/name/file.txt', () => {
        expect(pathJoin('some/', 'name/', 'file.txt')).toBe('some/name/file.txt');
    });

    it('/ + file.txt = file.txt', () => {
        expect(pathJoin('/', 'file.txt')).toBe('file.txt');
    });

    it('/hello + world = hello/world', () => {
        expect(pathJoin('/hello', 'world')).toBe('hello/world');
    });

})

// ---- pathName
describe('AppFileStorage.web.pathName', () => {

    it('some.txt', () => {
        expect(pathName('/some.txt')).toBe('some.txt');
    });

    it('dir/ = ""', () => {
        expect(pathName('dir/')).toBe('');
    });

    it('dir/subdir/file.txt = file.txt', () => {
        expect(pathName('dir/subdir/file.txt')).toBe('file.txt');
    })

})

// ---- pathParse
describe('AppFileStorage.web.pathParse', () => {

    it('some/name/file.txt', () => {
        expect(pathParse('some/name/file.txt')).toEqual({
            path: 'some/name/file.txt',
            name: 'file.txt',
            dir: 'some/name',
        });
    })

    it('/some/name/', () => {
        expect(pathParse('some/name/')).toEqual({
            path: 'some/name',
            name: '',
            dir: 'some/name',
        });
    })

    it('/', () => {
        expect(pathParse('/')).toEqual({
            path: '',
            name: '',
            dir: '',
        });
    })

})


