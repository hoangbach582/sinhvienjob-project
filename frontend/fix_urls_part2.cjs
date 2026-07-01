const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));
const API_ENV = "(import.meta.env.VITE_API_URL || 'https://sinhvienjob-project.onrender.com/api')";

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix double quotes: (${API_BASE}) + " -> (import.meta.env.VITE_API_URL || '...') + "
    content = content.replace(/\(\$\{API_BASE\}\) \+ "/g, API_ENV + ' + "');
    // Fix single quotes: (${API_BASE}) + ' -> (import.meta.env.VITE_API_URL || '...') + '
    content = content.replace(/\(\$\{API_BASE\}\) \+ '/g, API_ENV + " + '");
    // Fix backticks: ${${API_BASE}} -> ${(import.meta.env.VITE_API_URL || '...')}
    content = content.replace(/\$\{\$\{API_BASE\}\}/g, "${" + API_ENV + "}");

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed: ${file}`);
    }
});
console.log("Done");
