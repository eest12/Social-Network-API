import express from "express";
import fs from "fs";
import members from "../data/members.json" assert { type: "json" };
import friendships from "../data/friendships.json" assert { type: "json" };

const app = express();
const PORT = 3000;

// Receive requests in JSON format
app.use(express.json());

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

// GET member's friends by member ID
app.get("/member/:id/friends", (req, res) => {
    const memberId = Number(req.params.id);
    const filteredFriendships = friendships.filter((friendship) => friendship.member1_id === memberId);
    const friends = filteredFriendships.map((friendship) =>
        members.filter((member) => member.id === friendship.member2_id)
    );

    res.send(friends);
});

// GET a member's friend (returns empty set if the two members are not friends)
app.get("/member/:id1/friends/:id2", (req, res) => {
    const memberId = Number(req.params.id1);
    const friendId = Number(req.params.id2);
    const friendship = friendships.filter((friendship) =>
        (friendship.member1_id === memberId && friendship.member2_id === friendId)
        || (friendship.member1_id === friendId && friendship.member2_id === memberId)
    );
    const friend = friendship.length > 0 ? members.filter((member) => member.id === friendId) : [];

    res.send(friend);
});

// POST new member
app.post("/register", (req, res) => {
    const newId = members[members.length - 1].id + 1;
    const requiredFields = ["username", "first_name", "last_name", "email", "gender", "birthdate", "avatar"];

    // validate request body fields
    for (let i = 0; i < requiredFields.length; i++) {
        if (req.body[requiredFields[i]] == null) {
            return res.sendStatus(400);
        }
    }

    const newMember = {
        id: newId,
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        gender: req.body.gender,
        birthdate: req.body.birthdate,
        avatar: req.body.avatar
    };

    const updatedMembers = members.concat(newMember);
    const updatedMembersJson = JSON.stringify(updatedMembers);

    try {
        fs.writeFileSync("data/members.json", updatedMembersJson);
        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
})