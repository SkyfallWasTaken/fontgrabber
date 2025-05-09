// create-bookmarklet.js
import fs from 'fs/promises';
import path from 'path';

const sourceFile = 'fontgrabber.js'; // Your main JS file
const buildDir = 'build';
// Temporary file for Bun's minified output
const tempMinifiedFile = path.join(buildDir, 'fontgrabber.temp.min.js');
// Final output file for the bookmarklet
const finalBookmarkletFile = path.join(buildDir, 'fontgrabber.bookmarklet.js');

async function buildAndWrap() {
    try {
        // Ensure build directory exists
        await fs.mkdir(buildDir, { recursive: true });
        console.log(`Build directory '${buildDir}' ensured.`);

        // 1. Minify the source file using Bun build
        console.log(`Minifying '${sourceFile}' to '${tempMinifiedFile}'...`);
        // The `bun build` command outputs status to stderr, text result to stdout
        const buildProcess = Bun.spawnSync([
            'bun',
            'build',
            sourceFile,
            '--minify',
            '--outfile',
            tempMinifiedFile,
        ]);

        if (buildProcess.exitCode !== 0) {
            console.error('Bun build failed:');
            console.error(buildProcess.stderr.toString());
            process.exit(1);
        }
        console.log('Minification successful.');
        if (buildProcess.stdout.toString()) {
            console.log('Bun build stdout:', buildProcess.stdout.toString());
        }


        // 2. Read the minified content
        console.log(`Reading minified content from '${tempMinifiedFile}'...`);
        let minifiedContent = await fs.readFile(tempMinifiedFile, 'utf-8');
        minifiedContent = minifiedContent.trim(); // Clean up any extra whitespace

        // 3. Wrap in IIFE and prepend "javascript:"
        console.log('Wrapping content in IIFE and prepending "javascript:"...');
        const bookmarkletContent = `javascript:(function() {${minifiedContent}})();`;

        // 4. Write the final bookmarklet file
        console.log(`Writing bookmarklet to '${finalBookmarkletFile}'...`);
        await fs.writeFile(finalBookmarkletFile, bookmarkletContent, 'utf-8');
        console.log(
            `Bookmarklet successfully created at '${finalBookmarkletFile}'`
        );

        // 5. Clean up the temporary minified file
        console.log(`Cleaning up temporary file '${tempMinifiedFile}'...`);
        await fs.unlink(tempMinifiedFile);
        console.log('Cleanup complete.');

    } catch (error) {
        console.error('Error creating bookmarklet:', error);
        process.exit(1);
    }
}

buildAndWrap();
