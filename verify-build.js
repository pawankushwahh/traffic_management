const fs = require('fs');
const path = require('path');

// Check if frontend/build exists and contains index.html
const buildDir = path.join(__dirname, 'frontend', 'build');
const indexFile = path.join(buildDir, 'index.html');

console.log('Verifying build directory:', buildDir);

if (fs.existsSync(buildDir)) {
    console.log('✓ Build directory exists');
    if (fs.existsSync(indexFile)) {
        console.log('✓ index.html exists');
        console.log('Build verification successful!');
        process.exit(0);
    } else {
        console.error('✗ index.html not found in build directory');
        process.exit(1);
    }
} else {
    console.error('✗ Build directory not found');
    process.exit(1);
}
