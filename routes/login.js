const User = require("../models/user");
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

router.get("/", async (req, res, next) => {
  console.log("GET :/login");
  res.send("login Server");
});

// 어플 내에서의 일반 로그인
router.post("/normal", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);
  const findUser = User.findOne({
    email: email,
    password: password
  });

  findUser.getFilter();

  const result = await findUser.exec();

  console.log(result);
  const response = {};
  response["result"] = result != null ? "SUCCESS" : "FAIL";
  response["userId"] = result != null ? 1 : 0;

  console.log("POST : /login/normal");
  res.send(response);
});

// 소셜 로그인
router.post("/social", async (req, res, next) => {
});

module.exports = router;