import React from 'react';

const KNOWN_ISSUERS = [
    {match: /login\.microsoftonline\.com|sts\.windows\.net|login\.windows\.net/i, name: 'Microsoft Entra ID', url: 'https://learn.microsoft.com/entra/identity/'},
    {match: /accounts\.google\.com/i, name: 'Google', url: 'https://accounts.google.com'},
    {match: /skype/i, name: 'Skype'},
    {match: /live\.com|account\.microsoft\.com/i, name: 'Microsoft Account'},
    {match: /github/i, name: 'GitHub', url: 'https://github.com'},
];

export function issuerName(iss) {
    if (!iss || typeof iss !== 'string') return null;
    for (const k of KNOWN_ISSUERS) {
        if (k.match.test(iss)) return k;
    }
    return null;
}

export function renderIssuer(iss) {
    const k = issuerName(iss);
    if (k) {
        return k.url
            ? <a href={k.url} target="_blank" rel="noopener noreferrer">{k.name}</a>
            : <span>{k.name}</span>;
    }
    if (iss) {
        return <a href={iss} target="_blank" rel="noopener noreferrer">{iss}</a>;
    }
    return null;
}

export function describeIssuer(iss) {
    if (!iss) return null;
    return <span>This token was issued by {renderIssuer(iss)}.</span>;
}
