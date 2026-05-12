import {issuerName} from './issuers';

describe('issuerName', () => {
    test('resolves Microsoft Entra ID for sts.windows.net', () => {
        expect(issuerName('https://sts.windows.net/abc/').name).toBe('Microsoft Entra ID');
    });

    test('resolves Microsoft Entra ID for login.microsoftonline.com', () => {
        expect(issuerName('https://login.microsoftonline.com/tenant/').name).toBe('Microsoft Entra ID');
    });

    test('resolves Microsoft Entra ID for login.windows.net', () => {
        expect(issuerName('https://login.windows.net/common/').name).toBe('Microsoft Entra ID');
    });

    test('does NOT use the legacy "Azure Active Directory" name', () => {
        expect(issuerName('https://sts.windows.net/abc/').name).not.toBe('Azure Active Directory');
    });

    test('resolves Google', () => {
        expect(issuerName('https://accounts.google.com').name).toBe('Google');
    });

    test('resolves GitHub', () => {
        expect(issuerName('https://token.actions.githubusercontent.com').name).toBe('GitHub');
    });

    test('returns null for unknown issuers', () => {
        expect(issuerName('https://example.com/oauth')).toBeNull();
    });

    test('returns null for empty/invalid inputs', () => {
        expect(issuerName('')).toBeNull();
        expect(issuerName(null)).toBeNull();
        expect(issuerName(undefined)).toBeNull();
        expect(issuerName(123)).toBeNull();
    });
});
