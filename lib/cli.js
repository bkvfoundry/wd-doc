// shebang inserted by gulp

import meow from 'meow';
import pkg from '../';

var cli = meow({
  pkg: pkg,
  help: [
    'Usage',
    '  $ mdDoc [input]',
    '',
    'Examples',
    '  $ mdDoc',
    '  unicorns',
    '',
    '  $ mdDoc rainbows',
    '  unicorns & rainbows',
    '',
    'Options',
    ' --foo Lorem ipsum. Default: false'
  ]
});
