const path = require('node:path');
const fs = require('node:fs');
const EmbeddedPostgres = require('embedded-postgres').default;

const DATA_DIR = path.join(__dirname, '..', '.pgdata');
const DB_NAME = 'lets_buddy';

const pg = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  user: 'postgres',
  password: 'postgres',
  port: 5432,
  persistent: true,
  // Windows'ta Türkçe (ve bazı diğer) sistem locale adları initdb'nin ASCII
  // kontrolünü patlatıyor ("Turkish_Türkiye.1254"), o yüzden locale'i sabit C'ye ayarlıyoruz.
  initdbFlags: ['--locale=C'],
});

function isInitialised() {
  return fs.existsSync(path.join(DATA_DIR, 'PG_VERSION'));
}

async function start() {
  if (!isInitialised()) {
    console.log('Veritabanı kümesi ilk kez oluşturuluyor...');
    await pg.initialise();
  }

  await pg.start();
  console.log('PostgreSQL 5432 portunda çalışıyor (user: postgres / password: postgres).');

  try {
    await pg.createDatabase(DB_NAME);
    console.log(`"${DB_NAME}" veritabanı oluşturuldu.`);
  } catch {
    console.log(`"${DB_NAME}" veritabanı zaten mevcut.`);
  }

  console.log('');
  console.log('Bu pencereyi AÇIK bırak — kapatırsan PostgreSQL de duruyor.');
  console.log('Durdurmak için: Ctrl+C, ya da başka bir terminalde "npm run db:stop".');

  const shutdown = async () => {
    console.log('\nDurduruluyor...');
    await pg.stop();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

async function stop() {
  await pg.stop();
  console.log('PostgreSQL durduruldu.');
}

async function main() {
  const command = process.argv[2];
  if (command === 'start') {
    await start();
  } else if (command === 'stop') {
    await stop();
  } else {
    console.error('Kullanım: node scripts/db.js <start|stop>');
    process.exitCode = 1;
  }
}

void main();
