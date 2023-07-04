const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getCurrentUser, getUser, updateProfile, updateAvatar,
} = require('../controllers/users');
const RegularURL = require('../utils/RegularURL');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(RegularURL),
  }),
}), updateAvatar);

module.exports = router;
