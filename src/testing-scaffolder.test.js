import deepmerge from 'deepmerge';
import {scaffold as scaffoldCypress} from '@form8ion/cypress-scaffolder';
import {scaffold as scaffoldIsWebsiteVulnerable} from '@form8ion/is-website-vulnerable';

import any from '@travi/any';
import {when} from 'jest-when';
import {afterEach, describe, expect, it, vi} from 'vitest';

import scaffoldTesting from './testing-scaffolder.js';

vi.mock('@form8ion/cypress-scaffolder');
vi.mock('@form8ion/is-website-vulnerable');

describe('testing scaffolder', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should configure cypress for smoke testing', async () => {
    const projectRoot = any.string();
    const cypressResults = any.simpleObject();
    const vulnerableResults = any.simpleObject();
    const baseUrl = 'http://localhost:8000';
    when(scaffoldCypress)
      .calledWith({projectRoot, testDirectory: 'test/smoke/', testBaseUrl: baseUrl})
      .mockResolvedValue(cypressResults);
    when(scaffoldIsWebsiteVulnerable).calledWith({baseUrl}).mockResolvedValue(vulnerableResults);

    expect(await scaffoldTesting({projectRoot})).toEqual(deepmerge.all([
      cypressResults,
      vulnerableResults,
      {
        scripts: {
          'test:served': 'start-server-and-test \'npm start\' http://localhost:8000'
            + ' \'npm-run-all --print-label --parallel test:served:*\'',
          'test:served:smoke': 'run-s cypress:run'
        },
        devDependencies: ['start-server-and-test']
      }
    ]));
  });
});
