const seed = require('./packages/shared/src/data/seed-data.json');
console.log('Patients count:', seed.patients.length);
console.log('Patient names:');
seed.patients.forEach(p => console.log(p.id, p.name));
