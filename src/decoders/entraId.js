import {cracker as openidCracker, OpenIdValidator, base64UrlToBytes} from './openid';
import {crackJWT} from './common';
import {issuerName} from './issuers';

function stringToB64Url(s) {
    const bytes = new TextEncoder().encode(s);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function sha256B64Url(s) {
    const bytes = new TextEncoder().encode(s);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    let bin = '';
    const arr = new Uint8Array(hash);
    for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
    return btoa(bin).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// Replaces the "nonce" value inside the raw header JSON, preserving every other
// byte (whitespace, key order). The decoded JSON is signed verbatim, so doing
// the substitution at text level keeps the signing input byte-identical when
// nothing else changed.
export function transformHeaderJsonNonce(headerJson, newNonce) {
    return headerJson.replace(/("nonce"\s*:\s*")[^"\\]*(")/, `$1${newNonce}$2`);
}

export class EntraIdValidator extends OpenIdValidator {
    async getSigningInputs() {
        const {headerPart, payloadPart} = this.props;
        const headerBytes = base64UrlToBytes(headerPart, 'header');
        const headerJson = new TextDecoder('utf-8').decode(headerBytes);

        const match = headerJson.match(/"nonce"\s*:\s*"([^"\\]*)"/);
        if (!match) {
            return [{label: '', input: `${headerPart}.${payloadPart}`}];
        }

        const hashedNonce = await sha256B64Url(match[1]);
        const newHeaderJson = transformHeaderJsonNonce(headerJson, hashedNonce);
        const newHeaderPart = stringToB64Url(newHeaderJson);

        return [
            {label: ' (post transformed)', input: `${headerPart}.${payloadPart}`},
            {label: ' (pre transformed)', input: `${newHeaderPart}.${payloadPart}`},
        ];
    }
}

function isEntraIdToken(crackedToken) {
    const iss = crackedToken && crackedToken.payload && crackedToken.payload.iss;
    const k = issuerName(iss);
    return !!(k && k.name === 'Microsoft Entra ID');
}

export function cracker(token) {
    try {
        const trimmed = (token || '').trim();
        const crackedToken = crackJWT(trimmed);
        if (!crackedToken) return null;
        if (!isEntraIdToken(crackedToken)) return null;

        const hasNonce = crackedToken.header && Object.prototype.hasOwnProperty.call(crackedToken.header, 'nonce');
        if (!hasNonce) {
            return openidCracker(token);
        }

        return openidCracker(token, {
            Validator: EntraIdValidator,
            resultKey: 'EntraID-result',
            resultTitle: 'Microsoft Entra ID JWT',
        });
    } catch (_ignore) {
        return null;
    }
}
