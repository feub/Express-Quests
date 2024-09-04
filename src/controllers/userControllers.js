const database = require("../../database");

const getUsers = (req, res) => {
  const language = req.query.language;
  const city = req.query.city;
  const initialSql = "SELECT * FROM users";
  const where = [];

  if (language != null) {
    where.push({
      column: "language",
      value: language,
      operator: "=",
    });
  }

  if (city != null) {
    where.push({
      column: "city",
      value: city,
      operator: "=",
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
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("SELECT * FROM users WHERE id = ?", [id])
    .then(([user]) => {
      if (user.length !== 0) {
        res.status(200).json(user);
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
  getUsers,
  getUserById,
};
