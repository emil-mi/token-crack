import {cracker as jweCracker} from './jwe';
import {JWE_COLORS} from './jweColors';

function b64uJson(value) {
    return btoa(JSON.stringify(value))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function makeJwe(header = {alg: 'RSA-OAEP', enc: 'A256GCM'}, encryptedKey = 'AQID') {
    return `${b64uJson(header)}.${encryptedKey}.BAUG.BwgJ.CgsM`;
}

describe('jwe.cracker', () => {
    test('returns null for non-JWE and malformed inputs', () => {
        expect(jweCracker('hello')).toBeNull();
        expect(jweCracker('a.b.c')).toBeNull();
        expect(jweCracker('a.b.c.d.e.f')).toBeNull();
        expect(jweCracker('@@@@.AQID.BAUG.BwgJ.CgsM')).toBeNull();
    });

    test('parses a valid compact JWE', () => {
        const result = jweCracker(makeJwe());

        expect(result).toBeTruthy();
        expect(result.info).toBeNull();
        expect(result.regions).toHaveLength(5);
        expect(JSON.stringify(result.details)).toMatch(/JWE/);
        expect(JSON.stringify(result.details)).toMatch(/A256GCM/);
    });

    test('accepts an empty encrypted key for direct encryption', () => {
        expect(jweCracker(makeJwe({alg: 'dir', enc: 'A256GCM'}, ''))).toBeTruthy();
    });

    test('rejects an empty encrypted key for key-wrapping algorithms', () => {
        expect(jweCracker(makeJwe({alg: 'RSA-OAEP', enc: 'A256GCM'}, ''))).toBeNull();
    });

    test('rejects invalid binary segments', () => {
        const header = b64uJson({alg: 'dir', enc: 'A256GCM'});
        expect(jweCracker(`${header}.AA!A.BAUG.BwgJ.CgsM`)).toBeNull();
        expect(jweCracker(`${header}..AA!A.BwgJ.CgsM`)).toBeNull();
        expect(jweCracker(`${header}..BAUG.AA!A.CgsM`)).toBeNull();
        expect(jweCracker(`${header}..BAUG.BwgJ.AA!A`)).toBeNull();
    });

    test('rejects protected headers that are not JSON objects', () => {
        expect(jweCracker(`${b64uJson(null)}.AQID.BAUG.BwgJ.CgsM`)).toBeNull();
        expect(jweCracker(`${b64uJson([])}.AQID.BAUG.BwgJ.CgsM`)).toBeNull();
    });

    test('creates correctly colored regions with whitespace offsets', () => {
        const inner = makeJwe();
        const parts = inner.split('.');
        const result = jweCracker(`  ${inner}`);

        expect(result.regions.map(region => region.color)).toEqual([
            JWE_COLORS.header,
            JWE_COLORS.encryptedKey,
            JWE_COLORS.iv,
            JWE_COLORS.ciphertext,
            JWE_COLORS.tag,
        ]);
        expect(result.regions[0].start).toBe(2);
        expect(result.regions[0].end).toBe(2 + parts[0].length);
        expect(result.regions[4].end).toBe(2 + inner.length);
    });
});
