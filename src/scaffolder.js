import {promises as fs} from 'fs';

export default async function ({projectRoot}) {
  await fs.writeFile(`${projectRoot}/slides.md`, '');

  return {
    scripts: {
      dev: 'slidev',
      build: 'slidev build',
      export: 'slidev export'
    }
  };
}