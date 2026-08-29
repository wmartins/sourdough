import { mkdir, readdir, rename, rm } from 'node:fs/promises';
import path from 'node:path';

const [baseDirectory] = process.argv.slice(2);

if (!baseDirectory || baseDirectory.includes('/') || baseDirectory === '.') {
  console.error('Expected a single generated base-path directory name.');
  process.exit(1);
}

const clientDirectory = path.resolve('build/client');
const generatedBaseDirectory = path.join(clientDirectory, baseDirectory);

async function moveContents(sourceDirectory, targetDirectory) {
  await mkdir(targetDirectory, { recursive: true });

  for (const entry of await readdir(sourceDirectory, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDirectory, entry.name);
    const targetPath = path.join(targetDirectory, entry.name);

    if (entry.isDirectory()) {
      await moveContents(sourcePath, targetPath);
      await rm(sourcePath, { recursive: true });
      continue;
    }

    await rm(targetPath, { force: true });
    await rename(sourcePath, targetPath);
  }
}

await moveContents(generatedBaseDirectory, clientDirectory);
await rm(generatedBaseDirectory, { recursive: true });

console.log(
  `Prepared build/client for hosting at /${baseDirectory}/ without a doubled path.`,
);
