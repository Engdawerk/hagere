import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

// Destructure environment variables
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// Log the values (optional, for debugging purposes)
console.log(`PGHOST: ${PGHOST}`);
console.log(`PGUSER: ${PGUSER}`);
console.log(`PGDATABASE: ${PGDATABASE}`);

// Creates a SQL connection using your environment variables
export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);