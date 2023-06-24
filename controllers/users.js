const User = require('../models/user');

const ValidationErrorStatus = 400;
const CastErrorStatus = 404;
const DefaultErrorStatus = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(DefaultErrorStatus).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        res.status(CastErrorStatus).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }

      res.status(200).send({ data: user });
    })
    .catch(() => res.status(DefaultErrorStatus).send({ message: 'Произошла ошибка' }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ValidationErrorStatus).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }

      res.status(DefaultErrorStatus).send({ message: 'Произошла ошибка' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CastErrorStatus).send({ message: 'Пользователь с указанным id не найден.' });
        return;
      }

      if (err.name === 'ValidationError') {
        res.status(ValidationErrorStatus).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }

      res.status(DefaultErrorStatus).send({ message: 'Произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CastErrorStatus).send({ message: 'Пользователь с указанным id не найден.' });
        return;
      }

      if (err.name === 'ValidationError') {
        res.status(ValidationErrorStatus).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }

      res.status(DefaultErrorStatus).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUsers, getUser, createUser, updateProfile, updateAvatar,
};
