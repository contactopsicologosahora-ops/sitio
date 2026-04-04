const fs = require('fs');

const file = 'src/data/terapeutas.ts';
let content = fs.readFileSync(file, 'utf8');

// replace all price strings
content = content.replace(/price:\s*"(.*)"/g, (match, p1, offset, str) => {
    // Check if it's Juan Rojas
    const isJuanRojas = str.substring(offset - 250, offset).includes("Juan Rojas");
    if (isJuanRojas) return `price: "$55.000"`;
    return `price: "$40.000"`;
});

fs.writeFileSync(file, content, 'utf8');
console.log('Updated src/data/terapeutas.ts');
