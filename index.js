const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.jgifu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("emaJhon");
    const allProduct = database.collection("products");

    // get data
    app.get("/products", async (req, res) => {
       const coursor = allProduct.find({});
      const page = req.query.page;
      const size = parseInt(req.query.size);
      console.log(page, size);
     
      const count = await coursor.count();
      let Products;
      if (page) {
        Products = await coursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        Products = await coursor.toArray();
      }

      res.json({ count, Products });
    });

    app.post("/product/apiKey", async (req, res) => {
      const keys = req.body;
      
      const query = { key: { $in:keys } }
    const result=await allProduct.find(query).toArray()
    res.json(result)
})






  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("HI this is module 66");
});
app.listen(port, () => {
  console.log("Your listening port is", port);
});
