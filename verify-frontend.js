const fs = require('fs');
const path = require('path');

console.log('Current directory:', process.cwd());
console.log('Directory contents:', fs.readdirSync('.'));

const buildPath = path.join(process.cwd(), 'build');
if (fs.existsSync(buildPath)) {
    console.log('Build directory exists');
    console.log('Build directory contents:', fs.readdirSync(buildPath));
    
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        console.log('index.html exists');
        console.log('Build verification successful!');
        process.exit(0);
    } else {
        console.error('index.html not found in build directory');
        process.exit(1);
    }
} else {
    console.error('Build directory not found');
    process.exit(1);
}
