# Social Network API

An Express API.

## HTTP Routes

| Method | Path | Description |
| --- | --- | --- |
| GET | /members | Get all members |
| GET | /member/:id | Get member by ID |
| GET | /member/:id/friends | Get member's friends |
| GET | /member/:id1/friends/:id2 | Get member's friend (or empty set if the two members are not friends) |
| POST | /register | Create new member |
| DELETE | /member/:id/delete | Delete member |

## Data

The `data` directory contains two files: `members.json` and `friendships.json`. I will explain how to generate them, but the existing files can be used as they are.

### Members

The `members.json` file contains mock data that was generated using [Mockaroo](https://www.mockaroo.com/). It contains 50 rows and these fields (using Mockaroo's terminology):

| Field Name | Type          |
| ---------- | ------------- |
| id         | Row Number    |
| username   | Username      |
| first_name | First Name    |
| last_name  | Last Name     |
| email      | Email Address |
| gender     | Gender        |
| birthdate  | Datetime      |
| avatar     | Avatar        |

### Friendships

The `friendships.json` file was generated using the `src/friends-script.js` script. It consists of randomly assigned friendships between the members in `members.json`. A friendship is denoted by the key-value pair `member1_id: member2_id`. The fields look like this:

| Field Name | Type                     |
| ---------- | ------------------------ |
| member1_id | Row Number (Foreign Key) |
| member2_id | Row Number (Foreign Key) |

The following command can be used to generate new friendships:

    node src/friends-script.js [max_friends]

The optional `max_friends` argument specifies the maximum number of friends a single member can have. The default value is 25.