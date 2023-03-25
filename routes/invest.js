const { body, validationResult } = require("express-validator");

const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Stock = require("../models/Stock");
const User = require("../models/User");

router.get("/get", fetchuser, async (req, res) => {
  try {
    const stocks = await Stock.find({ user: req.user.id });
    res.json({ stocks });
  } catch (error) {
    res.send({ error });
  }
});

router.post("/buy", fetchuser, async (req, res) => {
  try {
    const userid = req.user.id;
    console.log(userid);
    let user = await User.findById({ _id: userid });
    console.log(user);
    const amount = user.amount;
    console.log(amount);
    const number = req.body.number;
    console.log(typeof req.body.number);
    const price = req.body.price;
    if (amount < number * price) {
      return res.send({ message: "Insufficient Balance" });
    }
    let stock = await Stock.findOne({
      user: userid,
      type: req.body.type,
      company: req.body.company,
    });
    if (stock != null) {
      const id = stock._id;
      user = await User.findByIdAndUpdate(userid, {
        amount: eval(user.amount - price * number),
      });
      stock = await Stock.findByIdAndUpdate(id, {
        number: eval(number + stock.number),
      });
      return res.send(stock);
    }
    stock = await Stock.create({
      user: userid,
      company: req.body.company,
      type: req.body.type,
      number: number,
      price: price,
    });
    user = await User.findByIdAndUpdate(userid, {
      amount: eval(user.amount - price * number),
    });
    console.log(user);
    res.send(stock);
  } catch (error) {
    res.send({ error: error.message });
  }
});

router.post("/sell", fetchuser, async (req, res) => {
  try {
    const userid = req.user.id;
    console.log(userid);
    let user = await User.findById({ _id: userid });
    console.log(user);
    const amount = user.amount;
    console.log(amount);
    const number = req.body.number;
    const price = req.body.price;
    let stock = await Stock.findOne({
      user: userid,
      type: req.body.type,
      company: req.body.company,
    });
      if (stock != null) {
          if (stock.number < number)
          {
             return res.send({ error: "Not able to sell" });
            }
      user = await User.findByIdAndUpdate(userid, {
        amount: eval(user.amount + price * number),
      });
      const id = stock._id;
      stock = await Stock.findByIdAndUpdate(id, {
        number: eval(stock.number-number),
      });
      return res.send(stock);
    } else {
      res.status(401).send({ error: "Not able to send" });
    }

    // user = await User.findByIdAndUpdate(userid, {
    //   amount: eval(user.amount - price * number),
    // });
    // console.log(user);
    // res.send(stock);
  } catch (error) {
    res.send({ error: error.message });
  }
});

module.exports = router;
