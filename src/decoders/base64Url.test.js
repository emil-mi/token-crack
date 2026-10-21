import {base64UrlToBytes} from './common';

describe('base64UrlToBytes', () => {
    test('decodes a standard 4-char base64url string', () => {
        // "AAAA" → 3 zero bytes
        const bytes = base64UrlToBytes('AAAA');
        expect(Array.from(bytes)).toEqual([0, 0, 0]);
    });

    test('decodes URL-safe alphabet (-, _) without padding', () => {
        // "+/" encoded as base64url is "-_". "Pz8/" (?? ?) → standard. Use a known case.
        // bytes [0xfb, 0xff, 0xbf] → standard b64 "+/+/" → url-safe "-_-_"
        const bytes = base64UrlToBytes('-_-_');
        expect(Array.from(bytes)).toEqual([0xfb, 0xff, 0xbf]);
    });

    test('decodes without padding when length is 4n+2', () => {
        // standard b64 "AQ==" (1 byte 0x01) → unpadded "AQ"
        const bytes = base64UrlToBytes('AQ');
        expect(Array.from(bytes)).toEqual([0x01]);
    });

    test('decodes without padding when length is 4n+3', () => {
        // standard b64 "AQI=" (2 bytes 0x01 0x02) → unpadded "AQI"
        const bytes = base64UrlToBytes('AQI');
        expect(Array.from(bytes)).toEqual([0x01, 0x02]);
    });

    test('strips and re-applies trailing padding', () => {
        const bytes = base64UrlToBytes('AQ==');
        expect(Array.from(bytes)).toEqual([0x01]);
    });

    test('rejects strings of length 4n+1 (impossible base64url length)', () => {
        // 341 chars was the real-world AAD-signature regression
        const truncated = 'A'.repeat(341);
        expect(() => base64UrlToBytes(truncated)).toThrow(/truncated|not a valid length/);
    });

    test('rejects strings of length 4n+1 with a friendly label', () => {
        expect(() => base64UrlToBytes('A'.repeat(5), 'signature'))
            .toThrow(/signature/);
    });

    test('rejects strings with non-base64url characters', () => {
        expect(() => base64UrlToBytes('AA!A')).toThrow(/not valid base64url/);
        expect(() => base64UrlToBytes('AA AA')).toThrow(/not valid base64url/);
    });

    test('rejects empty input', () => {
        expect(() => base64UrlToBytes('')).toThrow(/empty/);
    });

    test('round-trips a 342-char (256-byte) signature length', () => {
        // 342 chars maps to 256 bytes — the canonical RS256 signature length.
        // Use a buffer of zero bytes for a deterministic round-trip.
        const sig256 = btoa(String.fromCharCode(...new Array(256).fill(0)))
            .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        expect(sig256.length).toBe(342);
        const bytes = base64UrlToBytes(sig256);
        expect(bytes.length).toBe(256);
    });
});
