const Card = require('../models/card');

const ValidationErrorStatus = 400;
const CastErrorStatus = 404;
const DefaultErrorStatus = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(DefaultErrorStatus).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ValidationErrorStatus).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }

      res.status(DefaultErrorStatus).send({ message: 'Произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CastErrorStatus).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }

      res.status(DefaultErrorStatus).send({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.status(200).send({ data: card.likes }))
    .catch((err) => {
      if (!req.user._id) {
        res.status(ValidationErrorStatus).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }

      if (err.name === 'TypeError') {
        res.status(CastErrorStatus).send({ message: 'Передан несуществующий id карточки' });
        return;
      }

      res.status(DefaultErrorStatus).send({ message: 'Произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.status(200).send({ data: card.likes }))
    .catch((err) => {
      if (!req.user._id) {
        res.status(ValidationErrorStatus).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }

      if (err.name === 'TypeError') {
        res.status(CastErrorStatus).send({ message: 'Передан несуществующий id карточки' });
        return;
      }

      res.status(DefaultErrorStatus).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
