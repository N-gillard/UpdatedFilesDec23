module.exports = function (router, pgPool) {
  // PostgreSQL search function
  async function searchPostgres(query) {
      const client = await pgPool.connect();
      try {
          const pgQuery = `
              SELECT * FROM fishing_data
              WHERE FishName ILIKE $1
              OR Type ILIKE $1
              OR Location ILIKE $1
              OR DateCaught::TEXT ILIKE $1
              OR Weight::TEXT ILIKE $1
              OR AnglerName ILIKE $1;
          `;

          const pgResult = await client.query(pgQuery, [`%${query}%`]);
          return pgResult.rows;
      } finally {
          client.release();
      }
  }

  router.post('/', async (req, res) => {
      const { query } = req.body;

      try {
          const results = await searchPostgres(query);

          res.render('searchResults', { results });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });

  return router;
};

