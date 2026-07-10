import express from "express";

import { checkCppSimilarity } from "./core/checkCppSimilarity.js";
import cors from "cors";

app.use(cors());
const app = express();

const PORT = process.env.PORT || 5000;

app.use(
    express.json({
        limit: "1mb"
    })
);


app.post("/compare", (req, res) => {
    try {
        const { codeA, codeB } = req.body;

        if (
            typeof codeA !== "string" ||
            typeof codeB !== "string"
        ) {
            return res.status(400).json({
                error: "codeA and codeB must be strings."
            });
        }

        if (!codeA.trim() || !codeB.trim()) {
            return res.status(400).json({
                error: "Both C++ code samples are required."
            });
        }

        const result = checkCppSimilarity(codeA, codeB);

        return res.status(200).json(result);

    } catch (error) {
        console.error("Comparison failed:", error);

        return res.status(500).json({
            error: "Unable to compare the code samples."
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});