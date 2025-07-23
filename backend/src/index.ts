import express from "express";
import routeDecoder from "./routes/decoder";
import cors from "cors";

const app = express();

const port = process.env.PORT ?? "3000";

const corsOptions = {
  origin: "*",
  method: "GET",
};

app.use(cors(corsOptions));

app.use("/decoder", routeDecoder);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
