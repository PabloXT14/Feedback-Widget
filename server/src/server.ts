import express from 'express';

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json("Hello World");
})

app.listen(3333, () => console.log("Server running on port 3333"))