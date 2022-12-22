const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
// const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
//this is position is right ⬇ for app
const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2xlnexh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization;
//   console.log(authHeader);
//   if (!authHeader) {
//     res.status(401).send({ message: "unauthorized access" });
//   }
//   const token = authHeader.split(" ")[1];
//   console.log(token);
//   jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
//     if (err) {
//       res.status(401).send({ message: "unauthorized access" });
//     }
//     req.decoded = decoded;

//     next();
//   });
// }
async function run() {
  try {
    const serviceCollection = client.db("homeFood").collection("services");
    const reviewCollection = client.db("homeFood").collection("reviews");

    // app.post("/jwt", (req, res) => {
    //   const user = req.body;
    //   console.log(user);
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "222d" });

    //   res.send({ token });
    // });
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
    //reviews api
    app.get("/reviews", async (req, res) => {
      //again check
      // const decoded = req.decoded;

      //self data get
      // if (decoded.email !== req.decoded.email) {
      //   res.status(403).send({ message: "forbidden access" });
      // }
      let query = {};
      //filtering query
      // if (req.query.email) {
      //   query = {
      //     email: req.query.email,
      //   };
      // }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();

      res.send(reviews);
    });
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));
app.get("/", (req, res) => {
  res.send("HomeFood server is running");
});
app.listen(port, () => {
  console.log("HOME FOOD server is running on port: ", port);
});
