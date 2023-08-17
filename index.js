import express from "express";
import members from "./data/members.json" assert { type: "json" };

const app = express();
const PORT = 3000;

// GET all members
app.get("/members", (req, res) => {
    res.json(members);
});

// GET member by ID
app.get("/member/:id", (req, res) => {
    const memberId = Number(req.params.id);
    const member = members.filter((member) => member.id === memberId);
    res.send(member);
});

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
})