import { Pool } from 'pg';
import format from 'pg-format';

import config from '../utils/config';

const conopts = {
  host: config.DB_HOST,
  database: config.DB_DATABASE,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
};

const createTable = 'CREATE TABLE IF NOT EXISTS snow_kohde (id serial not null, resort varchar(50) not null, country varchar(20) default null, resort_url text default null, webcam_url text default null, elevation_bottom int default null, elevation_top int default null, season_start varchar(10) default null, season_end varchar(10) default null, resort_open boolean default null, snow_bottom int default null, snow_top int default null, last_snow int default null, last_snow_time varchar(8) default null, snow_3day int default null, snow_6day int default null, snow_9day int default null, weather varchar(15) default null, weather_24 varchar(15) default null, weather_48 varchar(15) default null, weather_72 varchar(15) default null, temperature int default null, temperature_bottom int default null, temperature_top int default null)';

const insertSnowReport = 'INSERT INTO snow_kohde (resort, country, resort_url, webcam_url, elevation_bottom, elevation_top, snow_bottom, snow_top, last_snow, last_snow_time, snow_3day, snow_6day, snow_9day) VALUES %L';

// const updateSnowReport = 'UPDATE snow_kohde SET ';

async function createDatabase(report: Array<Array<string | null>>): Promise<void> {
  const pool = new Pool(conopts);
  const client = await pool.connect();

  try {
    const create = await client.query(createTable);
    console.log({ create });

    const query = format(insertSnowReport, report);
    const insert = await client.query(query);
    console.log({ insert });
  } catch (error) {
    console.error(error);
  }

  client.release();
  await pool.end();
}

export default { createDatabase };
