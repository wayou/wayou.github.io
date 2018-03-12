'use strict';

const SOURCE_CODE_FILENAME = './hello-world.qs';

/**
 * QuipScript Just-In-Time (JIT) Compiler!
 * This amazing program reads in a QS file, compiles it & then runs it.
 * Compilation translates source code to object code, in this case JavaScript.
 */

const {readFileSync} = require('fs');
const sourceCode = readFileSync(SOURCE_CODE_FILENAME, 'utf8');

let program = `let string = '';\n`;

sourceCode
    .split('\n') // split into lines
    .forEach(line => {
        switch (line[0]) {
            case undefined:
                break; // empty line, do nothing
            case '#':
                break; // comment line, do nothing
            case '+': // concat, add line to string
                program += `string += '${line.slice(1)}';\n`;
                break;
            case '-': // remove letters from string
                program += `string = string.slice(0, ${line});\n`;
                break;
            case 'p': // print string
                program += 'console.log(string);\n';
                break;
            default:
                throw Error('unexpected token: ' + line);
        }
    });

// and now that we've compiled our source code (QS) to object code (JS),
// we run it (just in time!):

eval(program); // eslint-disable-line no-eval

// for debugging:

console.log('\n\nFYI, here is the compiled program:\n\n' + program);
