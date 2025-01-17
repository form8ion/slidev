import {promises as fs} from 'node:fs';

import any from '@travi/any';
import {when} from 'jest-when';
import {afterEach, describe, expect, it, vi} from 'vitest';

import scaffoldTesting from './testing-scaffolder.js';
import scaffold from './scaffolder.js';

vi.mock('node:fs');
vi.mock('./testing-scaffolder.js');

describe('scaffolder', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold the presentation', async () => {
    const projectRoot = any.string();
    const testingDevDependencies = any.listOf(any.word);
    const testingScripts = any.simpleObject();
    when(scaffoldTesting)
      .calledWith({projectRoot})
      .mockResolvedValue({
        devDependencies: testingDevDependencies,
        scripts: testingScripts
      });

    const {dependencies, devDependencies, scripts} = await scaffold({projectRoot});

    expect(fs.writeFile)
      .toHaveBeenCalledWith(
        `${projectRoot}/slides.md`,
        `---
theme: default

# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://source.unsplash.com/collection/94734566/1920x1080

# apply any windi css classes to the current slide
class: 'text-center'

# https://sli.dev/custom/highlighters.html
highlighter: prism

# some information about the slides, markdown enabled
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
---`
      );
    expect(dependencies.javascript.production).toEqual(['@slidev/cli', '@slidev/theme-default']);
    expect(devDependencies).toEqual(testingDevDependencies);
    expect(scripts).toEqual({dev: 'slidev', build: 'slidev build', export: 'slidev export', ...testingScripts});
  });
});
