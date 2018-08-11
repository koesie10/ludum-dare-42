const path = require('path');
const fs = require('fs');
const {execFileSync} = require('child_process');
const package = require('./package.json');

const butlerPath = path.join(process.env.APPDATA, 'itch', 'bin', 'butler.exe');

if (!fs.existsSync(butlerPath)) {
    console.error(`butler not found at ${butlerPath}`);
    return;
}

const channel = `${package.itch}:html`;

execFileSync(butlerPath, ['push', 'dist', channel]);

console.log(`Game uploaded to ${channel}`);
