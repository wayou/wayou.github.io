'use strict';

const SOURCE_CODE_FILENAME = './hello-world.qs';
const OUTPUT_CODE_FILENAME = './hello-world.js';

/**
 * QuipScript Optimizing Compiler!
 * This program reads a QS file, compiles it, optimizes it, & then outputs it.
 * Compilation translates source code to object code, in this case JavaScript.
 */

const {readFileSync, writeFileSync} = require('fs');
const sourceCode = readFileSync(SOURCE_CODE_FILENAME, 'utf8');

let program = '';
let string = '';

sourceCode
    .split('\n') // split into lines
    .filter(line => line && line[0] !== '#') // remove blank lines and comments
    .forEach(line => {
        switch (line[0]) {
            case '+': // concat, add line to string
                string += line.slice(1);
                break;
            case '-': // remove letters from string
                string = string.slice(0, +line);
                break;
            case 'p': // print string
                program += `console.log('${string}');\n`;
                break;
            default:
                throw Error(`unexpected token: ${line}`);
        }
    });

// and now that we've compiled our source code (QS) to object code (JS),
// we output it so the user can run it in the future:

writeFileSync(OUTPUT_CODE_FILENAME, program);

// for debugging:

console.log('Compiled to JS file. For reference:\n');
console.log(program);
