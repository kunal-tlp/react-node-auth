const express = require("express")
const indexrouter = require('./routes/index');
const cors = require("cors");
const app = express();

const port = 4002;
app.use(express.json());
app.use(cors());
app.use('/api', indexrouter)

app.listen(port, function () {
    console.log(`Listening on the Port ${port}`)
});
