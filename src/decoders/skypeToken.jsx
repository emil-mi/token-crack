import React from 'react';
import _ from 'lodash';

import {crackJWT} from './common';

const SkypeTokenScopes = [
    [1, "refresh"],
    [2, "uic"],
    [4, "identity"],
    [8, "identity_update"],
    [16, "contacts"],
    [32, "contacts_update"],
    [64, "reauth"],
    [128, "commerce"],
    [256, "communication"],
    [512, "communication_ro"],
    [956, "client"]
];

function getFlagNames(bitmask, scopes) {
    return _.join(_.compact(scopes.map(([k,v]) => (bitmask & k) === k ? v : null)), ", ")
}

function dateFromEpochSeconds(seconds, betterBeInTheFuture = false) {
    let date = new Date(seconds * 1000);
    let test = betterBeInTheFuture ?
        v=>_.lte(v, Date.now()) :
        v=>_.gt(v, Date.now());
    return test(date.valueOf()) ?
        <span className="date_future">{date.toISOString()}</span> :
        <span>{date.toISOString()}</span>;
}

/*
 Authentication:skypetoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjIifQ.eyJpYXQiOjE0NzcxNzYwMjcsImV4cCI6MTQ3NzI2MjQyNywic2t5cGVpZCI6ImVtaWwubWllaWxpY2EiLCJzY3AiOjk1OCwiY3NpIjoiOCIsImNpZCI6ImFiZWNkMWIzNTIyY2I1ZjgiLCJhYXQiOjE0NzcwMDc2NjR9.ck4dDkv9nqwj1-rGRh9CGxduMBYgAv0iA3ebPNefgDsWaqnQGgiTjrPatppN7I8P3-mRhiA3qphaai1C4ZiuM-5oByWGC7NvKWeD-vIikqQ_GlsMEtqXEd6kUXSZTnFE3AlZuwW7JeqTZSr8DibKpj2OMriWCEYueZvZ3nCXxH972U5f6PZCln_Uz3IlKASX8Iiw6RZ1c3-5Gzlk
 */
export function cracker(rawToken) {
    try {
        const stripped = rawToken
            .replace(/^(Authentication:\s*)?skypetoken=/i, "")
            .trim();
        const offset = rawToken.indexOf(stripped);

        let crackedToken = crackJWT(stripped);

        if (!crackedToken || !_.every(_.at(crackedToken, "header.kid", "payload.skypeid", "payload.scp"), Boolean)) {
            return null;
        }

        const parts = stripped.split('.');
        const hLen = parts[0].length;
        const pLen = parts[1].length;
        const sLen = parts[2].length;
        const base = offset < 0 ? 0 : offset;
        const regions = [
            {start: base, end: base + hLen, color: '#c62828', title: 'header'},
            {start: base + hLen + 1, end: base + hLen + 1 + pLen, color: '#1565c0', title: 'payload'},
            {start: base + hLen + 1 + pLen + 1, end: base + hLen + 1 + pLen + 1 + sLen, color: '#2e7d32', title: 'signature'},
        ];
        const info = <span>This token was issued by Skype.</span>;

        const details = <div key="SkypeToken-result">
            <aside>SkypeToken</aside>
            <table>
                <tbody>
                <tr>
                    <td>Key ID</td>
                    <td>{crackedToken.header.kid}</td>
                </tr>
                <tr>
                    <td>Issued time</td>
                    <td>{dateFromEpochSeconds(crackedToken.payload.iat)}</td>
                </tr>
                <tr>
                    <td>Expires</td>
                    <td>{dateFromEpochSeconds(crackedToken.payload.exp)}</td>
                </tr>
                <tr>
                    <td>Serial</td>
                    <td>{crackedToken.payload.csi}</td>
                </tr>
                <tr>
                    <td>Scopes</td>
                    <td>{`${getFlagNames(crackedToken.payload.scp, SkypeTokenScopes)} (${crackedToken.payload.scp})`}</td>
                </tr>
                <tr>
                    <td>SkypeID</td>
                    <td>{crackedToken.payload.skypeid}</td>
                </tr>
                <tr>
                    <td>Tenat</td>
                    <td>{crackedToken.payload.tid}</td>
                </tr>
                <tr>
                    <td>Region</td>
                    <td>{crackedToken.payload.rgn}</td>
                </tr>
                </tbody>
            </table>
        </div>;

        return {regions, info, details};
    }
    catch (_ignore) {
        return null;
    }
}
