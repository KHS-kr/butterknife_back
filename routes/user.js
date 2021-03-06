const User = require('../models/user');
const Post = require('../models/post');
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

router.get('/category/:id', async (req, res, next) => {
  console.log(req.params.id);
  const category = await User.findOne(
    { _id: req.params.id },
    { _id: false, category: true }
  );
  const retval = {
    data: category,
  };
  console.log(category);
  res.status(200).json(retval);
});

router.get('/nickname/:id', async (req, res) => {
  const userInfo = await User.findOne(
    { _id: req.params.id },
    { _id: true, nickname: true, profile: true }
  );

  const response = {};
  response['result'] = userInfo != null ? 'Success' : 'Fail';
  response['detail'] = userInfo != null ? '' : '잘못된 사용자입니다.';
  response['data'] = userInfo != null ? userInfo : null;
  console.log(response);
  res.status(200).send(response);
});

router.get('/:id', async (req, res) => {
  const userInfo = await User.findOne(
    { _id: req.params.id },
    { _id: false, email: false, password: false, __v: false, uid: false }
  );

  const response = {};
  response['result'] = userInfo != null ? 'Success' : 'Fail';
  response['detail'] = userInfo != null ? '' : '잘못된 사용자입니다.';
  response['data'] = userInfo != null ? userInfo : null;
  console.log(response);
  res.status(200).send(response);
});

router.put('/password/:id', async (req, res) => {
  const data = req.body;
  const response = {};

  const cryptoPW = crypto
    .createHash('sha512')
    .update(data.password)
    .digest('base64');

  const before = await User.findOne({ _id: req.params.id }, { password: true });

  if (before.password == cryptoPW) {
    // 이미 같은 비밀번호일 경우에는 에러 처리
    response['result'] = 'Fail';
    response['detail'] = '이전과 동일한 비밀번호입니다.';
  } else {
    const updatePW = await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          password: cryptoPW,
        },
      }
    );
    if (update.n === 1 && update.n === update.ok) {
      response['result'] = 'Success';
      if (update.nModified == 0) response['detail'] = '같은 내용입니다.';
    } else {
      response['result'] = 'Fail';
      response['detail'] =
        '비밀번호 변경 중 오류가 발생했습니다.\n다시 실행해주세요.';
    }
  }

  res.status(200).send(response);
});

router.put('/:id', async (req, res) => {
  const data = req.body;
  console.log(data);

  const updateNickname = await Post.updateMany(
    { writer_id: req.params.id },
    {
      $set: {
        writer_nickname: data.nickname,
      },
    }
  );

  const updateCommentNickname = await Post.updateMany(
    { 'comments.writer_id': req.params.id },
    {
      $set: {
        'comments.$.writer_nickname': data.nickname,
      },
    }
  );

  const update = await User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        phone_num: data.phone,
        nickname: data.nickname,
        category: data.category,
      },
    }
  );

  const response = {};

  if (update.n === 1 && update.n === update.ok) {
    response['result'] = 'Success';
    if (update.nModified == 0) response['detail'] = '같은 내용입니다.';
  } else {
    response['result'] = 'Fail';
    response['detail'] =
      '개인 정보 변경 중 오류가 발생했습니다.\n다시 실행해주세요.';
  }

  res.status(200).send(response);
});

router.put('/profile/:id', async (req, res) => {
  const data = req.body;
  console.log('herehere' + data);

  const updateCommentProfile = await Post.updateMany(
    { 'comments.writer_id': req.params.id },
    {
      $set: {
        'comments.$.profile': data.profile,
      },
    }
  );

  const updatePostProfile = await Post.updateMany(
    { writer_id: req.params.id },
    {
      $set: {
        profile: data.profile,
      },
    }
  );

  const updateLikeProfile = await Post.updateMany(
    { 'like_IDs.user_id': req.params.id },
    {
      $set: {
        'like_IDs.$.profile': data.profile,
      },
    }
  );

  const update = await User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        profile: data.profile,
      },
    }
  );

  const response = {};

  if (update.n === 1 && update.n === update.ok) {
    response['result'] = 'Success';
    if (update.nModified == 0) response['detail'] = '같은 내용입니다.';
  } else {
    response['result'] = 'Fail';
    response['detail'] =
      '개인 정보 변경 중 오류가 발생했습니다.\n다시 실행해주세요.';
  }

  res.status(200).send(response);
});

module.exports = router;
