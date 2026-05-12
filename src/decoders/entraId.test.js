import {cracker as entraIdCracker, transformHeaderJsonNonce} from './entraId';
import {cracker as pipelineCracker} from './index';

function b64u(obj) {
    return btoa(JSON.stringify(obj))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function makeJwt(header, payload, sig = 'AAAA') {
    return `${b64u(header)}.${b64u(payload)}.${sig}`;
}

const ENTRA_ISS = 'https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/';

describe('entraId.cracker', () => {
    test('returns null for non-Entra issuers', () => {
        const token = makeJwt({alg: 'RS256'}, {iss: 'https://example.com/op'});
        expect(entraIdCracker(token)).toBeNull();
    });

    test('returns null for tokens with no iss', () => {
        const token = makeJwt({alg: 'RS256'}, {sub: 'a'});
        expect(entraIdCracker(token)).toBeNull();
    });

    test('returns null for non-JWT input', () => {
        expect(entraIdCracker('garbage')).toBeNull();
        expect(entraIdCracker('')).toBeNull();
    });

    test('delegates to OpenID (matching shape) when Entra header has no nonce', () => {
        const token = makeJwt({alg: 'RS256'}, {iss: ENTRA_ISS});
        const result = entraIdCracker(token);
        expect(result).toBeTruthy();
        expect(result.details.key).toBe('OpenID-result');
    });

    test('produces a distinct EntraID result when header carries a nonce', () => {
        const token = makeJwt({alg: 'RS256', nonce: 'abc'}, {iss: ENTRA_ISS});
        const result = entraIdCracker(token);
        expect(result).toBeTruthy();
        expect(result.details.key).toBe('EntraID-result');
    });
});

describe('cracker pipeline ordering', () => {
    test('EntraID wins over OpenID for Entra tokens with a nonce', () => {
        const token = makeJwt({alg: 'RS256', nonce: 'abc'}, {iss: ENTRA_ISS});
        const results = pipelineCracker(token);
        expect(results[0].details.key).toBe('EntraID-result');
    });

    test('OpenID still wins for non-Entra OpenID tokens', () => {
        const token = makeJwt({alg: 'RS256', nonce: 'abc'}, {iss: 'https://accounts.google.com'});
        const results = pipelineCracker(token);
        expect(results[0].details.key).toBe('OpenID-result');
    });

    test('For Entra tokens without nonce, the EntraID cracker passes through the OpenID result', () => {
        const token = makeJwt({alg: 'RS256'}, {iss: ENTRA_ISS});
        const results = pipelineCracker(token);
        // EntraID returns the OpenID-shaped result, so the first match has the OpenID key.
        expect(results[0].details.key).toBe('OpenID-result');
    });
});

describe('transformHeaderJsonNonce', () => {
    test('replaces the nonce value preserving key order and whitespace', () => {
        const input = '{"typ":"JWT","nonce":"abc","alg":"RS256"}';
        const output = transformHeaderJsonNonce(input, 'XYZ');
        expect(output).toBe('{"typ":"JWT","nonce":"XYZ","alg":"RS256"}');
    });

    test('returns the original string when there is no nonce field', () => {
        const input = '{"typ":"JWT","alg":"RS256"}';
        expect(transformHeaderJsonNonce(input, 'XYZ')).toBe(input);
    });

    test('handles whitespace between key and value', () => {
        const input = '{"nonce" : "abc"}';
        expect(transformHeaderJsonNonce(input, 'X')).toBe('{"nonce" : "X"}');
    });
});
