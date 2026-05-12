import React from 'react';
import JSONPretty from 'react-json-pretty';

import {crackJWT} from './common.js';
import {renderIssuer} from './issuers.js';
import {JWT_COLORS} from './jwtColors.js';
import {JsonWithTimestamps} from './timestamps.js';

export function base64UrlToBytes(s, label = 'value') {
    if (typeof s !== 'string' || s.length === 0) {
        throw new Error(`${label} is empty`);
    }
    if (/[^A-Za-z0-9_\-=]/.test(s)) {
        throw new Error(`${label} contains characters that are not valid base64url`);
    }
    const stripped = s.replace(/=+$/, '');
    if (stripped.length % 4 === 1) {
        throw new Error(`${label} has ${stripped.length} base64url chars, which is not a valid length — the token looks truncated`);
    }
    let padded = stripped.replace(/-/g, '+').replace(/_/g, '/');
    while (padded.length % 4) padded += '=';
    let bin;
    try {
        bin = atob(padded);
    } catch (e) {
        throw new Error(`${label} is not valid base64url: ${e.message || e}`);
    }
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
}

function looksLikeUrl(s) {
    return typeof s === 'string' && /^https?:\/\//i.test(s);
}

export const ALG_TO_PARAMS = {
    RS256: {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'},
    RS384: {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-384'},
    RS512: {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-512'},
    PS256: {name: 'RSA-PSS', hash: 'SHA-256', saltLength: 32},
    PS384: {name: 'RSA-PSS', hash: 'SHA-384', saltLength: 48},
    PS512: {name: 'RSA-PSS', hash: 'SHA-512', saltLength: 64},
    ES256: {name: 'ECDSA', hash: 'SHA-256', namedCurve: 'P-256'},
    ES384: {name: 'ECDSA', hash: 'SHA-384', namedCurve: 'P-384'},
    ES512: {name: 'ECDSA', hash: 'SHA-512', namedCurve: 'P-521'},
};

export class OpenIdValidator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {status: 'pending', message: 'Validating signature against issuer JWKS...'};
        this._reqId = 0;
        this._mounted = false;
    }

    componentDidMount() {
        this._mounted = true;
        this.validate();
    }

    componentDidUpdate(prevProps) {
        const same =
            prevProps.issuer === this.props.issuer &&
            prevProps.kid === this.props.kid &&
            prevProps.alg === this.props.alg &&
            prevProps.headerPart === this.props.headerPart &&
            prevProps.payloadPart === this.props.payloadPart &&
            prevProps.signaturePart === this.props.signaturePart;
        if (!same) {
            this.validate();
        }
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    set(status, message) {
        if (this._mounted) this.setState({status, message});
    }

    // Override in subclasses to verify against multiple signing-input variants.
    // Each entry: {label, input}. The first variant whose signature verifies wins,
    // and its `label` is appended to the success message.
    async getSigningInputs() {
        const {headerPart, payloadPart} = this.props;
        return [{label: '', input: `${headerPart}.${payloadPart}`}];
    }

    async validate() {
        const myReq = ++this._reqId;
        const isCurrent = () => this._mounted && this._reqId === myReq;
        const {issuer, kid, alg, headerPart, payloadPart, signaturePart} = this.props;

        try {
            const params = ALG_TO_PARAMS[alg];
            if (!params) {
                this.set('warn', `Algorithm "${alg}" is not supported by this validator.`);
                return;
            }

            const wellKnown = issuer.replace(/\/$/, '') + '/.well-known/openid-configuration';
            if (isCurrent()) this.set('pending', `Fetching ${wellKnown}…`);
            const cfgRes = await fetch(wellKnown);
            if (!isCurrent()) return;
            if (!cfgRes.ok) throw new Error(`OpenID configuration HTTP ${cfgRes.status}`);
            const cfg = await cfgRes.json();
            if (!isCurrent()) return;
            if (!cfg.jwks_uri) throw new Error('OpenID configuration is missing jwks_uri');

            this.set('pending', `Fetching JWKS from ${cfg.jwks_uri}…`);
            const jwksRes = await fetch(cfg.jwks_uri);
            if (!isCurrent()) return;
            if (!jwksRes.ok) throw new Error(`JWKS HTTP ${jwksRes.status}`);
            const jwks = await jwksRes.json();
            if (!isCurrent()) return;

            const keys = (jwks && jwks.keys) || [];
            const key = (kid && keys.find(k => k.kid === kid)) || (keys.length === 1 ? keys[0] : null);
            if (!key) throw new Error(kid ? `No key in JWKS matches kid "${kid}"` : 'JWKS has multiple keys and the JWT has no kid');

            const jwk = {...key, alg, ext: true};
            const cryptoKey = await crypto.subtle.importKey('jwk', jwk, params, false, ['verify']);
            if (!isCurrent()) return;

            const sig = base64UrlToBytes(signaturePart, 'signature');
            const candidates = await this.getSigningInputs();
            if (!isCurrent()) return;

            let matched = null;
            for (const cand of candidates) {
                const data = new TextEncoder().encode(cand.input);
                if (await crypto.subtle.verify(params, cryptoKey, sig, data)) {
                    matched = cand;
                    break;
                }
                if (!isCurrent()) return;
            }

            if (matched) {
                this.set('ok', `Signature is valid${matched.label || ''} (alg ${alg}, kid ${key.kid || '—'}).`);
            } else {
                this.set('bad', `Signature is INVALID (alg ${alg}, kid ${key.kid || '—'}).`);
            }
        } catch (err) {
            this.set('error', `Could not validate: ${err && err.message ? err.message : String(err)}`);
        }
    }

    render() {
        const {status, message} = this.state;
        const color = {
            pending: '#666',
            ok: '#2e7d32',
            bad: '#c62828',
            warn: '#b26a00',
            error: '#b26a00',
        }[status] || '#444';
        const marker = {ok: '✓', bad: '✗', pending: '…', warn: '!', error: '!'}[status] || '';
        return (
            <span style={{color}}>
                <strong style={{marginRight: '0.4em'}}>{marker}</strong>
                {message}
            </span>
        );
    }
}

export function cracker(token, {Validator = OpenIdValidator, resultKey = 'OpenID-result', resultTitle = 'OpenID JWT'} = {}) {
    try {
        const startOffset = token.length - token.trimStart().length;
        const trimmed = token.trim();
        const parts = trimmed.split('.');
        if (parts.length !== 3) return null;

        const crackedToken = crackJWT(trimmed);
        if (!crackedToken) return null;

        const iss = crackedToken.payload && crackedToken.payload.iss;
        if (!looksLikeUrl(iss)) return null;

        const hLen = parts[0].length;
        const pLen = parts[1].length;
        const sLen = parts[2].length;
        const regions = [
            {start: startOffset, end: startOffset + hLen, color: JWT_COLORS.header, title: 'header'},
            {start: startOffset + hLen + 1, end: startOffset + hLen + 1 + pLen, color: JWT_COLORS.payload, title: 'payload'},
            {start: startOffset + hLen + 1 + pLen + 1, end: startOffset + hLen + 1 + pLen + 1 + sLen, color: JWT_COLORS.signature, title: 'signature'},
        ];

        const info = (
            <div>
                <div>
                    This token was issued by {renderIssuer(iss)}.
                </div>
                <div style={{marginTop: '0.4em'}}>
                    <Validator
                        issuer={iss}
                        kid={crackedToken.header && crackedToken.header.kid}
                        alg={crackedToken.header && crackedToken.header.alg}
                        headerPart={parts[0]}
                        payloadPart={parts[1]}
                        signaturePart={parts[2]}
                    />
                </div>
            </div>
        );

        const details = (
            <div key={resultKey}>
                <aside>{resultTitle}</aside>
                <table>
                    <tbody>
                    <tr style={{color: JWT_COLORS.header}}>
                        <td>header</td>
                        <td><JSONPretty json={crackedToken.header} mainStyle={`color:${JWT_COLORS.header}`}></JSONPretty></td>
                    </tr>
                    <tr style={{color: JWT_COLORS.payload}}>
                        <td>payload</td>
                        <td>
                            <JsonWithTimestamps json={crackedToken.payload} color={JWT_COLORS.payload} />
                        </td>
                    </tr>
                    <tr style={{color: JWT_COLORS.signature}}>
                        <td>signature</td>
                        <td style={{wordBreak: 'break-all'}}>{crackedToken.signature}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );

        return {regions, info, details};
    } catch (_ignore) {
        return null;
    }
}
