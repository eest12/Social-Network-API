import express from "express";
import fs from "fs";
import members from "../data/members.json" assert { type: "json" };
import friendships from "../data/friendships.json" assert { type: "json" };

const app = express();
const PORT = 3000;

// re-writes new data to the specified json file
function updateData(dataPath, newData) {
    const newDataJson = JSON.stringify(newData);

    try {
        fs.writeFileSync(dataPath, newDataJson);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

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
    const requestedId = Number(req.params.id);

    // find all friendships that the requested member is a part of
    const filteredFriendships = friendships.filter((friendship) =>
        friendship.member1_id === requestedId || friendship.member2_id === requestedId
    );

    // for every friendship, return the *other* member's profile, resulting in an array of friends' profiles
    const friends = filteredFriendships.map((friendship) =>
        members.filter((member) =>
            member.id === (requestedId === friendship.member1_id ? friendship.member2_id : friendship.member1_id)
        )
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

    updateData("data/members.json", updatedMembers) ? res.sendStatus(201) : res.sendStatus(400);
});

// POST new friendship
app.post("/member/:id1/befriend/:id2", (req, res) => {
    const id1 = Number(req.params.id1);
    const id2 = Number(req.params.id2);
    const member1Id = Math.min(id1, id2);
    const member2Id = Math.max(id1, id2);

    // check if already exists
    const friendship = friendships.filter((friendship) =>
        friendship.member1_id === member1Id && friendship.member2_id === member2Id
    );

    if (friendship.length > 0) {
        return res.sendStatus(400);
    }

    const newFriendship = {
        member1_id: member1Id,
        member2_id: member2Id
    };

    const updatedFriendships = friendships.concat(newFriendship);

    updateData("data/friendships.json", updatedFriendships) ? res.sendStatus(202) : res.sendStatus(400);
});

// DELETE member
app.delete("/member/:id/delete", (req, res) => {
    const memberId = Number(req.params.id);
    const updatedMembers = members.filter((member) => member.id !== memberId);

    updateData("data/members.json", updatedMembers) ? res.sendStatus(204) : res.sendStatus(400);
});

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
})