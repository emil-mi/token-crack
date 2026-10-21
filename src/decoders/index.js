import _ from 'lodash';

import * as base64 from './base64';
import * as jwe from './jwe';
import * as jwt from './jwt';
import * as entraId from './entraId';
import * as openid from './openid';
import * as skypeToken from './skypeToken';
import * as regToken from './regToken';
import * as syncState from './syncState';

export function cracker(token) {
    const tests = _.over(
        skypeToken.cracker,
        entraId.cracker,
        openid.cracker,
        jwe.cracker,
        jwt.cracker,
        regToken.cracker,
        syncState.cracker,
        base64.cracker,
    );

    return _.compact(tests(token));
}
