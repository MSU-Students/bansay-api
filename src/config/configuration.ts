
export default () => ({
  port: parseInt(String(process.env.PORT), 10) || 3030,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(String(process.env.DATABASE_PORT), 10) || 5432,
    dbName: process.env.DATABASE_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
});
