import dotenv from 'dotenv';

dotenv.config({ path: __dirname+'/../../.env' });

// interface ENV {
//   DB_HOST: string | undefined;
//   DB_DATABASE: string | undefined;
//   DB_USER: string | undefined;
//   DB_PASSWORD: string | undefined;
// }

// const getConfig = (): ENV => {
//   return {
//     DB_HOST: process.env.DB_HOST,
//     DB_DATABASE: process.env.DB_DATABASE,
//     DB_USER: process.env.DB_USER,
//     DB_PASSWORD: process.env.DB_PASSWORD,
//   };
// };

interface ENV {
  DB_STRING: string | undefined;
}

const getConfig = (): ENV => {
  return {
    DB_STRING: process.env.DB_STRING,
  };
};

const config = getConfig();

export default config;
