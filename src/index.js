const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes");
const { ServerConfig, Queue } = require("./config");
const CRON = require("./utils/common/cron-jobs");

const app = express();

app.use(cors({ origin: "http://localhost:5173"}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
    CRON();
    await Queue.connectQueue();
    console.log("queue connected");
});
