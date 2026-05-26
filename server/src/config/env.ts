export const env = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
};

console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('TYPE:', typeof process.env.DB_PASSWORD);