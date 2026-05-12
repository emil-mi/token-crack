import {cracker as jwtCracker} from './jwt.js';
import {JWT_COLORS} from './jwtColors.js';

function b64u(obj) {
    return btoa(JSON.stringify(obj))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function makeJwt(header, payload, sig = 'AAAA') {
    return `${b64u(header)}.${b64u(payload)}.${sig}`;
}

describe('jwt.cracker', () => {
    test('returns null for non-JWT strings', () => {
        expect(jwtCracker('hello')).toBeNull();
        expect(jwtCracker('foo.bar')).toBeNull();
        expect(jwtCracker('')).toBeNull();
    });

    test('returns null for malformed payloads', () => {
        // header.payload.sig but payload is not valid base64
        expect(jwtCracker('AAAA.@@@@.AAAA')).toBeNull();
    });

    test('returns {regions, info, details} for a valid JWT', () => {
        const token = makeJwt({alg: 'RS256'}, {sub: 'a'});
        const result = jwtCracker(token);
        expect(result).toBeTruthy();
        expect(result.regions).toBeInstanceOf(Array);
        expect(result.details).toBeTruthy();
    });

    test('produces 3 regions matching header/payload/signature offsets', () => {
        const token = makeJwt({alg: 'RS256'}, {sub: 'a'}, 'AAAA');
        const parts = token.split('.');
        const result = jwtCracker(token);
        expect(result.regions).toHaveLength(3);

        const [h, p, s] = result.regions;
        expect(h.start).toBe(0);
        expect(h.end).toBe(parts[0].length);

        expect(p.start).toBe(parts[0].length + 1);
        expect(p.end).toBe(parts[0].length + 1 + parts[1].length);

        expect(s.start).toBe(parts[0].length + 1 + parts[1].length + 1);
        expect(s.end).toBe(token.length);
    });

    test('regions use the shared JWT_COLORS palette', () => {
        const token = makeJwt({alg: 'RS256'}, {sub: 'a'});
        const [h, p, s] = jwtCracker(token).regions;
        expect(h.color).toBe(JWT_COLORS.header);
        expect(p.color).toBe(JWT_COLORS.payload);
        expect(s.color).toBe(JWT_COLORS.signature);
    });

    test('shifts region offsets by leading whitespace', () => {
        const inner = makeJwt({alg: 'RS256'}, {sub: 'a'});
        const padded = '   ' + inner;
        const result = jwtCracker(padded);
        expect(result.regions[0].start).toBe(3);
        expect(result.regions[2].end).toBe(padded.length);
    });

    test('info is null when there is no iss claim', () => {
        const token = makeJwt({alg: 'RS256'}, {sub: 'a'});
        expect(jwtCracker(token).info).toBeNull();
    });

    test('info names Microsoft Entra ID for sts.windows.net issuers', () => {
        const token = makeJwt({alg: 'RS256'}, {iss: 'https://sts.windows.net/abc/'});
        const info = jwtCracker(token).info;
        // info is a React element; serialize its descendants to text
        const text = JSON.stringify(info);
        expect(text).toMatch(/Microsoft Entra ID/);
        expect(text).not.toMatch(/Azure Active Directory/);
    });
});
