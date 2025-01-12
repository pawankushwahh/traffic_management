const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
    // Create the destination folder if it doesn't exist
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }

    // Read all files/folders in the source directory
    const files = fs.readdirSync(from);

    files.forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);

        if (fs.lstatSync(fromPath).isFile()) {
            // If it's a file, copy it
            fs.copyFileSync(fromPath, toPath);
            console.log(`Copied file: ${element}`);
        } else {
            // If it's a directory, recursively copy it
            copyFolderSync(fromPath, toPath);
            console.log(`Copied directory: ${element}`);
        }
    });
}

try {
    const sourceDir = path.join(__dirname, 'frontend', 'build');
    const targetDir = path.join(__dirname, 'build');

    console.log('Source directory:', sourceDir);
    console.log('Target directory:', targetDir);

    if (!fs.existsSync(sourceDir)) {
        console.error('Source build directory does not exist!');
        process.exit(1);
    }

    // Remove existing build directory if it exists
    if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true });
        console.log('Removed existing build directory');
    }

    // Copy the build directory
    copyFolderSync(sourceDir, targetDir);
    console.log('Successfully copied build directory');

    // Verify the copy
    if (fs.existsSync(path.join(targetDir, 'index.html'))) {
        console.log('Build copy verified successfully!');
        process.exit(0);
    } else {
        console.error('Build copy verification failed!');
        process.exit(1);
    }
} catch (error) {
    console.error('Error during build copy:', error);
    process.exit(1);
}
