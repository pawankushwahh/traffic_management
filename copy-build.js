const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
    // Create the destination folder if it doesn't exist
    if (!fs.existsSync(to)) {
        console.log(`Creating directory: ${to}`);
        fs.mkdirSync(to, { recursive: true });
    }

    // Read all files/folders in the source directory
    console.log(`Reading source directory: ${from}`);
    const files = fs.readdirSync(from);
    console.log(`Found ${files.length} items to copy`);

    files.forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);

        if (fs.lstatSync(fromPath).isFile()) {
            // If it's a file, copy it
            fs.copyFileSync(fromPath, toPath);
            console.log(`Copied file: ${element} (${fs.statSync(toPath).size} bytes)`);
        } else {
            // If it's a directory, recursively copy it
            copyFolderSync(fromPath, toPath);
            console.log(`Copied directory: ${element}`);
        }
    });
}

try {
    console.log('Starting build copy process...');
    console.log('Current working directory:', process.cwd());
    console.log('Directory contents:', fs.readdirSync(process.cwd()));

    const sourceDir = path.join(process.cwd(), 'frontend', 'build');
    const targetDir = path.join(process.cwd(), 'build');

    console.log('\nSource directory:', sourceDir);
    console.log('Target directory:', targetDir);

    if (!fs.existsSync(sourceDir)) {
        console.error('\nERROR: Source build directory does not exist!');
        console.log('Checking frontend directory contents:');
        const frontendPath = path.join(process.cwd(), 'frontend');
        if (fs.existsSync(frontendPath)) {
            console.log('Frontend directory contents:', fs.readdirSync(frontendPath));
        } else {
            console.log('Frontend directory does not exist!');
        }
        process.exit(1);
    }

    console.log('\nSource directory contents:', fs.readdirSync(sourceDir));

    // Remove existing build directory if it exists
    if (fs.existsSync(targetDir)) {
        console.log('\nRemoving existing build directory');
        fs.rmSync(targetDir, { recursive: true });
    }

    // Copy the build directory
    console.log('\nStarting directory copy...');
    copyFolderSync(sourceDir, targetDir);
    console.log('Successfully copied build directory');

    // Verify the copy
    console.log('\nVerifying build copy...');
    const targetContents = fs.readdirSync(targetDir);
    console.log('Build directory contents:', targetContents);

    if (fs.existsSync(path.join(targetDir, 'index.html'))) {
        console.log('Build copy verified successfully!');
        process.exit(0);
    } else {
        console.error('Build copy verification failed - index.html not found!');
        process.exit(1);
    }
} catch (error) {
    console.error('\nError during build copy:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
}
