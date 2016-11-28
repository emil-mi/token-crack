import _ from 'lodash';
import {readString, readInt, readBytes} from './common.js';
import base64 from 'base64-js';
import long from 'long';

import React from 'react';
import JSONPretty from 'react-json-pretty';

function readPp(io) {
    let pos, result={};
    pos = io;

    result.as = function(){ let result; [pos, result] = readString(pos); return result; }();
    result.bd = function(){ let result; [pos, result] = readString(pos); return result; }();
    result.bdp = function(){ let result; [pos, result] = readString(pos); return result; }();
    result.cid = function(){ let result; [pos, result] = readInt(pos, 8); return result; }();
    result.country = function(){ let result; [pos, result] = readString(pos); return result; }();
    result.dfu = function(){ let result; [pos, result] = readInt(pos); return result; }();
    result.fname = function(){ let result; [pos, result] = readString(pos); return result; }();
    result.fla = function(){ let result; [pos, result] = readInt(pos); return result; }();
    result.gen = function(){ let result; [pos, result] = readString(pos); return result; }();
    result.isid = function(){ let result; [pos, result] = readInt(pos, 4, false); return result; }();
    result.lp = function(){ let result; [pos, result] = readInt(pos, 2); return result; }();
    result.lri = function(){ let result; [pos, result] = readInt(pos, 8); return result; }();
    result.mname = function(){ let result; [pos, result] = readString(pos); return result; }();
    result.pcode = function(){ let result; [pos, result] = readString(pos); return result; }();
    result.puidh = function(){ let result; [pos, result] = readInt(pos, 4, true); return result; }();
    result.puidl = function(){ let result; [pos, result] = readInt(pos, 4, true); return result; }();
    result.rep = function(){ let result; [pos, result] = readString(pos); return result; }();
    result.wal = function(){ let result; [pos, result] = readInt(pos); return result; }();

    return [pos, result];
}

function deserializeAuthContext(byteArray) {
    let pos;
    pos = byteArray;

    const authType = function(){ let result; [pos, result] = readString(pos); return result; }();
    const name = function(){ let result; [pos, result] = readString(pos); return result; }();
    const hasPp = function(){ let result; [pos, result] = readInt(pos, 1); return result; }();

    const pp = function(){
        let result;
        if (hasPp!=0) {
            [pos, result] = readPp(pos);
        }
        return result;
    }();

    const numIds = function(){ let result; [pos, result] = readInt(pos); return result; }();
    const identifiers = [];
    let rui = function(){ let result; [pos, result] = readInt(pos, 8); return result; };

    for(let i=0; i< numIds; i++) {
        let identifier = rui();
        identifiers.push(identifier);
    }

    const isrea = function(){ let result; [pos, result] = readInt(pos, 1); return result; }();
    const hassky = function(){ let result; [pos, result] = readInt(pos, 1); return result; }();

    const skyid = function(){
        let result;
        if (hassky!=0) {
            [pos, result] = readString(pos);
        }
        return result;
    }();

    const uictsn = function(){ let result; [pos, result] = readInt(pos); return result; }();

    const hastid = function(){ let result; [pos, result] = readInt(pos, 1); return result; }();
    const tid = function(){
        let result;
        if (hastid!=0) {
            [pos, result] = readBytes(pos, 16);
        }
        return result;
    }();

    const csid = function(){ let result; [pos, result] = readInt(pos); return result; }();

    const numScp = function(){ let result; [pos, result] = readInt(pos); return result; }();
    const scp = [];
    let rscp = function(){ let result; [pos, result] = readString(pos); return result; };

    for(let i=0; i< numScp; i++) {
        let scope = rscp();
        scp.push(scope);
    }

    return _.cloneDeepWith({authType, name, hasPp, pp, numIds, identifiers, isrea, hassky, skyid, uictsn, hastid, tid, csid, numScp, scp},
        item=> long.isLong(item) ? item.toString() : undefined);
}

/*
 Set-RegistrationToken:registrationToken=U2lnbmF0dXJlOjI6Mjg6QVFRQUFBREloK3BpYlMyaGd0VDN6R21sT2lvdTtWZXJzaW9uOjY6MToxO0lzc3VlVGltZTo0OjE5OjUyNDc4MTM3NTU0MTEwMDIzMjM7RXAuSWRUeXBlOjc6MToxO0VwLklkOjI6MjU6ZW1pbC5taWVpbGljYUBvdXRsb29rLmNvbTtFcC5FcGlkOjU6MzY6NGVlYjQ4MzAtZDM3Yy00M2I0LTg5ZTQtMTY1NzBjOTI3NjNlO0VwLkxvZ2luVGltZTo3OjE6MDtFcC5BdXRoVGltZTo0OjE5OjUyNDc4MTM3NTU0MDg2NTg1NTI7RXAuQXV0aFR5cGU6NzoyOjE1O0VwLkV4cFRpbWU6NDoxODo2MzYxMjg1OTIyNzAwMDAwMDA7VXNyLk5ldE1hc2s6MTE6MTozO1Vzci5YZnJDbnQ6NjoxOjE7VXNyLlJkcmN0RmxnOjI6MTA6R2VvSG9zdGluZztVc3IuRXhwSWQ6OToxOjA7VXNyLkV4cElkTGFzdExvZzo0OjE6MDtVc2VyLkF0aEN0eHQ6MjoyNzY6Q2xOcmVYQmxWRzlyWlc0WlpXMXBiQzV0YVdWcGJHbGpZVUJ2ZFhSc2IyOXJMbU52YlFFRFZXbGpGREV2TVM4d01EQXhJREV5T2pBd09qQXdJRUZOREU1dmRGTndaV05wWm1sbFpQaTFMRkt6MGV5ckFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUExbGJXbHNMbTFwWldsc2FXTmhBQUFBQUFBQUFBQUFCMDV2VTJOdmNtVUFBQUFBQkFBQUFBQUFBQUFBQUFBQStMVXNVclBSN0tzQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFFTlpXMXBiQzV0YVdWcGJHbGpZUUFBQUFBQUFBQUFBQT09Ow==; expires=1477263298; endpointId={4eeb4830-d37c-43b4-89e4-16570c92763e}
 */
export function cracker(token) {
    try {
        token = token
            .replace(/^((Set-)?RegistrationToken:\s*)?registrationToken=/i,"")
            .trim()
            .split(";")[0];

        if (!token) {
            return;
        }

        let decoded = atob(token);

        let entries = _.compact(decoded.split(";"))
            .map(term=>{
                let [key, , ,value] = term.split(":");
                return {key, value};
            })
            .map( ({key,value})=> key==="User.AthCtxt" ? {key, value: deserializeAuthContext(base64.toByteArray(value))} : {key, value} );

        if (entries.length === 1) {
            return;
        }

        return <div key="RegToken-result">
            <aside>RegToken</aside>
            <table>
                <tbody>
                { entries.map(e=><tr key={e.key}><td>{e.key}</td><td>{ _.isObject(e.value) ? <JSONPretty json={e.value}></JSONPretty> : e.value }</td></tr>)}
                </tbody>
            </table>
        </div>
    }
    catch (_ignore) {
        return null;
    }
}
