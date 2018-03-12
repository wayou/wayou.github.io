'use strict';

const SOURCE_CODE_FILENAME = './hello-world.qs';

/**
 * QuipScript Interpreter!
 * This amazing program reads in a QS file and interprets it.
 * Interpretation executes the desired behavior "live" as source code is read.
 */

const {readFileSync} = require('fs');
const sourceCode = readFileSync(SOURCE_CODE_FILENAME, 'utf8');

let string = '';

sourceCode
    .split('\n') // split into lines
    .forEach(line => {
        switch (line[0]) {
            case undefined:
                break; // empty line, do nothing
            case '#':
                break; // comment line, do nothing
            case '+':
                string += line.slice(1);
                break; // concat, add line to string
            case '-':
                string = string.slice(0, +line);
                break; // remove letters
            case 'p':
                console.log(string);
                break; // print string state now
            default:
                throw Error('unexpected token: ' + line);
        }
    });
