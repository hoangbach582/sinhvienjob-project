const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Fix SVG attributes
            content = content.replace(/stroke-linecap/g, 'strokeLinecap');
            content = content.replace(/stroke-linejoin/g, 'strokeLinejoin');
            content = content.replace(/stroke-width/g, 'strokeWidth');
            
            // Fix class= to className= (careful with class components or other uses, but typically in jsx it's class=" or class={)
            content = content.replace(/ class="/g, ' className="');
            content = content.replace(/ class=\{/g, ' className={');
            content = content.replace(/\<[a-zA-Z0-9]+\s+class=/g, (match) => match.replace('class=', 'className='));
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir('./frontend/src');
console.log('Done');
