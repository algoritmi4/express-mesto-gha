const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
        return;
      }

      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;

  Card.findOne({ _id: id })
    .orFail(new NotFoundError('Карточка с указанным id не найдена'))
    .then((card) => {
      // eslint-disable-next-line eqeqeq
      if (!(card.owner == req.user._id)) {
        throw new ForbiddenError('Карточка не принадлежит пользователю');
      } else {
        Card.findByIdAndRemove(req.params.id)
          .then(() => {
            res.status(200).send({ data: card });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный id'));
        return;
      }

      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.status(200).send({ data: card.likes }))
    .catch((err) => {
      if (!req.user._id) {
        next(new ValidationError('Переданы некорректные данные для постановки лайка'));
        return;
      }

      if (err.name === 'TypeError') {
        next(new NotFoundError('Передан несуществующий id карточки'));
        return;
      }

      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный id'));
        return;
      }

      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.status(200).send({ data: card.likes }))
    .catch((err) => {
      if (!req.user._id) {
        next(new ValidationError('Переданы некорректные данные для постановки лайка'));
        return;
      }

      if (err.name === 'TypeError') {
        next(new NotFoundError('Передан несуществующий id карточки'));
        return;
      }

      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный id'));
        return;
      }

      next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
