import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';

await fs.rm('./src', { force: true, recursive: true });
await fs.rm('./dist', { force: true, recursive: true });

await fs.mkdir('./src');
await fs.mkdir('./dist');

await Promise.all([
	fs.copyFile('../astro/components/ViewTransitions.astro', './dist/ViewTransitions.astro'),
	fs.cp('../astro/src/transitions/', './src', { recursive: true }),
]);

await Promise.all([
	await fs.rm('./src/vite-plugin-transitions.ts'),
	await sed('astro:transitions/client', '..', './dist/ViewTransitions.astro'),
])


spawn('tsc', { stdio: 'inherit' })

async function sed(match, replacement, filePath) {
	const content = await fs.readFile(filePath, { encoding: 'utf-8' })
	return fs.writeFile(filePath, content.replaceAll(match, replacement), { encoding: 'utf-8' });
}
