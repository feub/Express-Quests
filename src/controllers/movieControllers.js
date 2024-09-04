const database = require("../../database");

const getMovies = (req, res) => {
  const qs = req.query.color;
  const max_duration = parseInt(req.query.max_duration);
  let initialSql = "SELECT * FROM movies";
  let where = [];

  if (qs != null) {
    where.push({
      column: "color",
      value: qs,
      operator: "=",
    });
  }

  if (max_duration != null) {
    where.push({
      column: "duration",
      value: max_duration,
      operator: "<=",
    });
  }

  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
        initialSql,
      ),
      where.map(({ value }) => value),
    )
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("SELECT * FROM movies WHERE id = ?", [id])
    .then(([movie]) => {
      if (movie.length !== 0) {
        res.status(200).json(movie);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

module.exports = {
  getMovies,
  getMovieById,
};
