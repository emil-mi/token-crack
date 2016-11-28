import React from 'react';
import _ from 'lodash';

import * as base64 from './base64.js';
import * as jwt from './jwt.js';
import * as skypeToken from './skypeToken.js';
import * as regToken from './regToken.js';
import * as syncState from './syncState.js';

export function cracker(token) {
    let tests = _.over(skypeToken.cracker, jwt.cracker, regToken.cracker, syncState.cracker, base64.cracker);

    return _.compact(tests(token));
}
