const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER_NAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    define: {
      underscored: true,
    },
    logging: false,
  }
);

async function loadSequelize() {
  try {
    await sequelize.authenticate();
    console.log("Db Connected");

    sequelize.sync().then((res) => {
      console.log("Database synchronized.");
    });
    return { success: "success" };

    // sequelize
    //   .query(
    //     "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'",
    //     { type: sequelize.QueryTypes.SELECT }
    //   )
    //   .then((tables) => {
    //     tables.forEach((table) => {
    //       const tableName = table.tablename;
    //       sequelize
    //         .query(`DROP TABLE IF EXISTS "${tableName}"`, { raw: true })
    //         .then(() => {
    //           console.log(`Dropped table: ${tableName}`);
    //         })
    //         .catch((error) => {
    //           console.error(`Error dropping table: ${tableName}`, error);
    //         });
    //     });
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching table names:", error);
    //   });

    //   await sequelize.query(
    //     `CREATE OR REPLACE FUNCTION uuid_or_null(str text) RETURNS uuid AS $$ BEGIN RETURN str::uuid; EXCEPTION WHEN invalid_text_representation THEN RETURN NULL; END; $$ LANGUAGE plpgsql;`
    //   );
    //   await sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    //   await sequelize.query(`

    //     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_rescuers_size') THEN
    //       CREATE TYPE enum_rescuers_size AS ENUM ('small', 'medium', 'large');
    //     END IF;

    // `);
  } catch (error) {
    console.error("Database connection or synchronization failed: ", error);
    return { err: error };
  }
}

module.exports = {
  sequelize,
  loadSequelize,
};
