const Joi = require("joi");

const movieSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  director: Joi.string().min(2).max(255).required(),
  year: Joi.number().integer().min(1800).max(2300).required(),
  color: Joi.string().min(2).max(255).required(),
  duration: Joi.number().integer().min(0).max(1000).required(),
});

const validateMovie = (req, res, next) => {
  const { title, director, year, color, duration } = req.body;

  const { error } = movieSchema.validate(
    { title, director, year, color, duration },
    { abortEarly: false },
  );

  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    next();
  }
};

module.exports = validateMovie;
