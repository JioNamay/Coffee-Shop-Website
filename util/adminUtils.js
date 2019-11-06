const { Pool } = require('pg');
const secrets = (process.env.NODE_ENV !== 'production') ? require("../secrets") : undefined;
const databaseConnectionString = process.env.DATABASE_URL || secrets.database;

const pool = new Pool({
    connectionString: databaseConnectionString,
    ssl: false
});

/**
 * Validates the admin that is currently logged in (so not just anybody can add/remove/edit things in the database.
 * @param id - The ID of the currently logged in admin.
 * @returns {Promise<boolean>} True if the provided id is an adminID on the table
 */
const adminAuth = async (id) => {
    const db = await pool.connect();
    const checkExistsQuery = `SELECT * FROM administrators WHERE adminID=$1;`;
    const checkExists = await db.query(checkExistsQuery, [id]);
    const result = checkExists ? checkExists.rows : null;
    const valid = result.length > 0;
    db.release();
    return valid;
};

module.exports = {adminAuth};
