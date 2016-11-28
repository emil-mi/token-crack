import _ from 'lodash';
import {readInt, readByteFragment} from './common.js';
import long from 'long';

import React from 'react';
import JSONPretty from 'react-json-pretty';

/*
 syncState=1a8a39e0d9570100000000000057000000f8b52c52b3d1ecab0d000000656d696c2e6d6965696c696361fd04098c430100000100000000000000000b21412c58010000018a39e0d9570100000b21412c580100000100000000000000000b21412c58010000018a39e0d9570100000b21412c5801000001e00a3807580100000b21412c58010000000000000000000000000000&
 */
export function cracker(state) {
    try {
        state = (state.match(/[0-9a-fA-F]{4,}/) || [])[0];
        if (!state || state.length%2) {
            return null;
        }

        let bytes = _.chunk(state, 2)
            .map(grp=>grp.join(''))
            .map(byte=>Number.parseInt(byte, 16));

        let pos;
        pos = bytes;

        const i$ver = function(){ let result; [pos, result] = readInt(pos, 1); return result; }();
        const sta = function(){ let result; [pos, result] = readInt(pos, 8); return new Date(result.toNumber()); }();

        const ntwrk = function(){ let result; [pos, result] = readByteFragment(pos); return result.string(); }();
        const c$flt = function(){ let result; [pos, result] = readInt(pos); return result; }();
        const cid = function(){ let result; [pos, result] = readInt(pos, 8); return result; }();
        const skypeId = function(){ let result; [pos, result] = readByteFragment(pos); return result.string(); }();
        const ver = function(){ let result; [pos, result] = readInt(pos, 8); return result; }();
        const dSeg = _.range(i$ver>=25 ? 5 : 4).map(()=> {
            const numSegments = function(){ let result; [pos, result] = readInt(pos, 1); return result; }();
            return _.range(numSegments).map( ()=> {
                return {
                    start: function(){ let result; [pos, result] = readInt(pos, 8); return new Date(result.toNumber()); }(),
                    end: function(){ let result; [pos, result] = readInt(pos, 8); return new Date(result.toNumber()); }()
                };
            })
        });

        if (!skypeId ||
            [sta, ..._.flatten(_.flatten(dSeg).map( seg=> [seg.start, seg.end]))].some( d=> isNaN(d.getTime()))
        ) {
            return null;
        }

        const lcVer = function(){ let result; [pos, result] = readInt(pos, 8); return result; }();
        const lcID = (lcVer > 0) && function(){ let result; [pos, result] = readByteFragment(pos); return result.string(); }();
        const thID = (i$ver>=25) && function(){ let result; [pos, result] = readByteFragment(pos); return result.string(); }();

        const result = _.cloneDeepWith({i$ver, sta, ntwrk, c$flt, cid, skypeId, ver, dSeg, lcVer, lcID, thID}, item=> long.isLong(item) ? item.toString() : undefined );
        return <div key="SyncState-result">
            <aside>SyncState</aside>
            <div><JSONPretty json={result}></JSONPretty></div>
        </div>;
    }
    catch (_ignore) {
        return null;
    }
}
