import {cracker as openidCracker} from './openid';
import {cracker as pipelineCracker} from './index';
import {JWT_COLORS} from './jwtColors';

function b64u(obj) {
    return btoa(JSON.stringify(obj))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function makeJwt(header, payload, sig = 'AAAA') {
    return `${b64u(header)}.${b64u(payload)}.${sig}`;
}

describe('openid.cracker', () => {
    test('returns null when the JWT has no URL-shaped iss claim', () => {
        const token = makeJwt({alg: 'RS256'}, {sub: 'a'});
        expect(openidCracker(token)).toBeNull();
    });

    test('returns null for tokens whose iss is not http(s)', () => {
        const token = makeJwt({alg: 'RS256'}, {iss: 'urn:example'});
        expect(openidCracker(token)).toBeNull();
    });

    test('returns null for non-JWT input', () => {
        expect(openidCracker('not.a.jwt!')).toBeNull();
        expect(openidCracker('only.two')).toBeNull();
    });

    test('matches when iss is an https URL', () => {
        const token = makeJwt({alg: 'RS256'}, {iss: 'https://sts.windows.net/abc/'});
        const result = openidCracker(token);
        expect(result).toBeTruthy();
        expect(result.regions).toHaveLength(3);
        expect(result.info).toBeTruthy();
        expect(result.details).toBeTruthy();
    });

    test('regions use shared JWT_COLORS', () => {
        const token = makeJwt({alg: 'RS256'}, {iss: 'https://example.com/op'});
        const [h, p, s] = openidCracker(token).regions;
        expect(h.color).toBe(JWT_COLORS.header);
        expect(p.color).toBe(JWT_COLORS.payload);
        expect(s.color).toBe(JWT_COLORS.signature);
    });

    test('info displays the friendly issuer name when known', () => {
        const token = makeJwt({alg: 'RS256'}, {iss: 'https://sts.windows.net/abc/'});
        const info = JSON.stringify(openidCracker(token).info);
        expect(info).toMatch(/Microsoft Entra ID/);
    });
});

describe('cracker pipeline order', () => {
    test('OpenID wins over plain JWT when iss is a URL', () => {
        const token = makeJwt({alg: 'RS256'}, {iss: 'https://example.com/op'});
        const results = pipelineCracker(token);
        const first = results[0];
        // crackers return {regions, info, details}; details is a React element with a key
        // The OpenID details element has key="OpenID-result"
        expect(first.details.key).toBe('OpenID-result');
    });

    test('plain JWT wins when iss is missing', () => {
        const token = makeJwt({alg: 'RS256'}, {sub: 'a'});
        const results = pipelineCracker(token);
        const first = results[0];
        // crackers return {regions, info, details}; details is a React element with a key
        expect(first.details.key).toBe('JWT-result');
    });
});
