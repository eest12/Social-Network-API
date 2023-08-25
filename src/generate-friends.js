export function generateFriends(members, maxFriends) {
    const friends = [];
    const friendCountById = {};

    for (let i = 0; i < members.length; i++) {
        const member1 = members[i];

        // add member1 to dictionary if not already in it
        if (!(member1.id in friendCountById)) {
            friendCountById[member1.id] = 0;
        }

        for (let j = i + 1; j < members.length && friendCountById[member1.id] < maxFriends; j++) {
            const member2 = members[j];

            // Randomly decide if member2 should be a friend (20% chance)
            // and then only add that friend if member2's friend list isn't full.
            // Since IDs are in increasing order, there is no chance of member1 already being friends with member2,
            // or member2 being the same as member1.
            if (Math.random() > 0.8 && (!(member2.id in friendCountById) || friendCountById[member2.id] < maxFriends)) {
                // add member2 to dictionary if not already in it
                if (!(member2.id in friendCountById)) {
                    friendCountById[member2.id] = 0;
                }

                // update table and friend count
                friends.push({ "member1_id": member1.id, "member2_id": member2.id });
                friendCountById[member1.id] += 1;
                friendCountById[member2.id] += 1;
            }
        }
    }

    return friends;
}