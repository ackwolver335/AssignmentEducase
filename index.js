    import express from "express";
    import cors from "cors";
    import dotenv from "dotenv";

    import connectDB from "./config/db.js";
    import authRoutes from './routes/auth.js'

    dotenv.config();
    const app = express();

    // MiddleWare
    app.use(express.json());
    app.use(cors());

    connectDB()
    .then(() => {
        console.log("Connected to MongoDB Succesfully !");
    })
    .catch((error) => {
        console.error(error.message);
        process.exit(1);
    });

    // available routes
    app.use("/api/auth", authRoutes);

    app.get("/", (req, res) => {
    res.send("API is running !");
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
    });
