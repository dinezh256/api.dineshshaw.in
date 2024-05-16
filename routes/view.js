const express = require("express");

const { View } = require("../models/view");

const router = express.Router();

router.post("/:id", (req, res) => {
  try {
    View.findOneAndUpdate(
      { blogId: req.params.id },
      { $inc: { count: 1 } },
      { new: true, upsert: true },
      (error, doc) => {
        if (error) {
          console.error("Error incrementing the views count", error);
          res.status(500).send({ message: error.message });
        } else {
          res
            .status(200)
            .send({ message: "Views counter incremented", count: doc.count });
        }
      }
    );
  } catch (error) {
    console.error("Error incrementing the views count", error);
    res.status(500).send({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const views = await View.findOne({ blogId: Number(req.params.id) });
    if (views.count) {
      res.status(200).send({ count: views.count });
    } else {
      res.status(401).send({ message: "Count Not Found" });
    }
  } catch (error) {
    console.log({ error });
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
