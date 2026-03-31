const fs = require('fs');
const path = require('path');

const routesDir = path.join('c:', 'Users', 'Windows', 'Desktop', 'project', 'backend', 'routes');

const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js') && f !== 'auth.js' && f !== 'tasks.js');

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace different variations of auth middleware
  // Variation 1: 
  const regex1 = /\/\/ Auth Middleware\nconst auth = \(req, res, next\) => \{[\s\S]*?res\.status\(401\)\.json\(\{ message: 'Token invalid' \}\);\n  \}\n\};/g;
  
  // Variation 2:
  const regex2 = /\/\/ Middleware to protect routes(?: \(with temporary development bypass\))?\nconst auth = \(req, res, next\) => \{[\s\S]*?res\.status\(401\)\.json\(\{ message: 'Token is not valid' \}\);\n  \}\n\};/g;
  
  // Variation 3:
  const regex3 = /\/\/ Middleware.*?\nconst auth = \(req, res, next\) => \{[\s\S]*?\n\};/g;
  
  let replaced = false;
  if(regex1.test(content)) {
    content = content.replace(regex1, "const auth = require('../middleware/auth');");
    replaced = true;
  } else if (regex2.test(content)) {
    content = content.replace(regex2, "const auth = require('../middleware/auth');");
    replaced = true;
  } else if (regex3.test(content)) {
    content = content.replace(regex3, "const auth = require('../middleware/auth');");
    replaced = true;
  } else {
    // If not matching, just try finding "const auth = " to "};"
    const match = content.match(/const auth = \(req, res, next\) => \{[\s\S]*?\n\};\n/);
    if(match) {
        content = content.replace(match[0], "const auth = require('../middleware/auth');\n");
        replaced = true;
    }
  }

  if (replaced) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`Could not find auth middleware in ${file}`);
  }
});
