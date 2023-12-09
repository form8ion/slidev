// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {scaffold} from './lib/index.js';

// remark-usage-ignore-next
stubbedFs({node_modules: stubbedFs.load('node_modules')});

// #### Execute

(async () => {
  await scaffold({projectRoot: process.cwd()});
})();
