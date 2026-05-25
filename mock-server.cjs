const jsonServer = require('json-server');
const server = jsonServer.create();
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'mock-data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Build initial in-memory DB by reading all individual JSONs
const getData = () => {
  const db = {};
  if (fs.existsSync(dataDir)) {
    fs.readdirSync(dataDir)
      .filter(f => f.endsWith('.json'))
      .forEach(f => {
        const key = f.replace('.json', '');
        try {
          db[key] = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf-8'));
        } catch (e) {
          console.error(`Error reading ${f}`, e);
        }
      });
  }
  return db;
};

let dbState = getData();
// Fallback if empty
if (Object.keys(dbState).length === 0) {
  try {
     const oldDb = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf-8'));
     Object.keys(oldDb).forEach(key => {
        fs.writeFileSync(path.join(dataDir, `${key}.json`), JSON.stringify(oldDb[key], null, 2));
        dbState[key] = oldDb[key];
     });
  } catch (e) {
     dbState = {
       user: { id: 1, email: 'test@test.pl', username: 'Test User', is_active: true },
       plans: [], history: [], sessions: [], exercises: [], statistics: {}
    };
  }
}

const router = jsonServer.router(dbState);
const middlewares = jsonServer.defaults();

router.render = (req, res) => {
  const state = router.db.getState();
  Object.keys(state).forEach(key => {
    fs.writeFileSync(
      path.join(dataDir, `${key}.json`), 
      JSON.stringify(state[key], null, 2)
    );
  });
  res.jsonp(res.locals.data);
};

server.use(middlewares);
server.use(router);

server.listen(8000, () => {
  console.log('JSON Server split running on port 8000. Data stored inside /mock-data/*.json');
});