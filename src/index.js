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

// returns a list of the members that are friends with the member denoted by memberId
function getFriends(memberId) {
    // find all friendships that the member is a part of
    const filteredFriendships = friendships.filter((friendship) =>
        friendship.member1_id === memberId || friendship.member2_id === memberId
    );

    // for every friendship, return the *other* member's profile, resulting in an array of friends' profiles
    const friends = filteredFriendships.map((friendship) =>
        members.filter((member) =>
            member.id === (memberId === friendship.member1_id ? friendship.member2_id : friendship.member1_id)
        )[0]
    );

    return friends;
}

// Receive requests in JSON format
app.use(express.json());

// GET all members
app.get("/members", (req, res) => {
    res.json(members);
});

app.route("/member/:id")

    // GET member by ID
    .get((req, res) => {
        const memberId = Number(req.params.id);
        const member = members.filter((member) => member.id === memberId);
        res.send(member);
    })

    // DELETE member and all friendships associated with it
    .delete((req, res) => {
        const memberId = Number(req.params.id);
        const updatedMembers = members.filter((member) => member.id !== memberId);

        // check if nothing was removed
        if (updatedMembers.length == members.length) {
            return res.status(400).send({ message: "Invalid member ID." });
        }

        // remove all friendships involving the deleted member
        const updatedFriendships = friendships.filter((friendship) =>
            friendship.member1_id !== memberId && friendship.member2_id !== memberId
        );

        // send error status if any friendships were removed but the dataset was not successfully updated
        if (updatedFriendships.length < friendships.length && !updateData("data/friendships.json", updatedFriendships)) {
            return res.sendStatus(400);
        }

        updateData("data/members.json", updatedMembers) ? res.sendStatus(204) : res.sendStatus(400);
    });

// GET member's friends by member ID
app.get("/member/:id/friends", (req, res) => {
    const memberId = Number(req.params.id);
    const friends = getFriends(memberId);

    res.send(friends);
});

app.route("/member/:id1/friend/:id2")

    // GET a member's friend (returns empty set if the two members are not friends)
    .get((req, res) => {
        const memberId = Number(req.params.id1);
        const friendId = Number(req.params.id2);
        const friendship = friendships.filter((friendship) =>
            (friendship.member1_id === memberId && friendship.member2_id === friendId)
            || (friendship.member1_id === friendId && friendship.member2_id === memberId)
        );
        const friend = friendship.length > 0 ? members.filter((member) => member.id === friendId) : [];

        res.send(friend);
    })

    // POST new friendship
    .post((req, res) => {
        const id1 = Number(req.params.id1);
        const id2 = Number(req.params.id2);
        const member1Id = Math.min(id1, id2);
        const member2Id = Math.max(id1, id2);

        // check if the two member IDs are the same
        if (member1Id === member2Id) {
            return res.status(400).send({ message: "Member IDs must be different." });
        }

        // make sure both member IDs exist
        const membersBecomingFriends = members.filter((member) =>
            member.id === member1Id || member.id === member2Id
        );

        if (membersBecomingFriends.length != 2) {
            return res.status(400).send({ message: "Invalid member ID." });
        }

        // check if friendship already exists
        for (let i = 0; i < friendships.length; i++) {
            if (friendships[i].member1_id === member1Id && friendships[i].member2_id === member2Id) {
                return res.status(400).send({ message: "Friendship already exists." });
            }
        }

        const newFriendship = {
            member1_id: member1Id,
            member2_id: member2Id
        };

        const updatedFriendships = friendships.concat(newFriendship);

        updateData("data/friendships.json", updatedFriendships) ? res.sendStatus(202) : res.sendStatus(400);
    })

    // DELETE friendship
    .delete((req, res) => {
        const id1 = Number(req.params.id1);
        const id2 = Number(req.params.id2);
        const member1Id = Math.min(id1, id2);
        const member2Id = Math.max(id1, id2);

        // keep all friendships except for the one with member1Id and member2Id
        const updatedFriendships = friendships.filter((friendship) =>
            !(friendship.member1_id === member1Id && friendship.member2_id === member2Id)
        );

        // check if nothing was removed
        if (updatedFriendships.length == friendships.length) {
            return res.status(400).send({ message: "Friendship not found." });
        }

        updateData("data/friendships.json", updatedFriendships) ? res.sendStatus(204) : res.sendStatus(400);
    });

// GET member feed (friends' statuses)
app.get("/member/:id/feed", (req, res) => {
    const memberId = Number(req.params.id);
    const friends = getFriends(memberId);
    const friendsWithStatuses = friends.filter((friend) => friend.status != null);
    const feed = friendsWithStatuses.map((friend) => (
        {
            "username": friend.username,
            "status": friend.status
        }
    ));

    res.send(feed);
});

// POST new member
app.post("/register", (req, res) => {
    const newId = members[members.length - 1].id + 1;
    const requiredFields = ["username", "first_name", "last_name", "email", "gender", "birthdate", "avatar"];

    // validate request body fields
    for (let i = 0; i < requiredFields.length; i++) {
        if (req.body[requiredFields[i]] == null) {
            return res.status(400).send({ message: `Request body missing '${requiredFields[i]}' field.` });
        }
    }

    // make sure username and email are unique
    for (let i = 0; i < members.length; i++) {
        if (members[i].username == req.body["username"]) {
            return res.status(400).send({ message: "Username already exists." });
        }

        if (members[i].email == req.body["email"]) {
            return res.status(400).send({ message: "Email already exists." });
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
        avatar: req.body.avatar,
        status: req.body.status ? req.body.status : null
    };

    const updatedMembers = members.concat(newMember);

    updateData("data/members.json", updatedMembers) ? res.sendStatus(201) : res.sendStatus(400);
});

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
})