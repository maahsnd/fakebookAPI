const { faker } = require('@faker-js/faker');
const User = require('./models/User');
const FriendRequest = require('./models/FriendRequest');

async function createRandomUser() {
  const user = new User({
    _id: faker.database.mongodbObjectId(),
    username: faker.person.fullName()
  });
  await user.save();
  return user;
}

async function createFriendRequests(to, from) {
  const friendRequest = new FriendRequest({
    from: from._id,
    to: to._id
  });
  to.friendRequests.push(friendRequest);
  from.friendRequests.push(friendRequest);
  await Promise.all([to.save(), from.save(), friendRequest.save()]);
}

exports.createUsers = async () => {
  const userCount = 5;
  const users = [];

  for (let i = 0; i < userCount; i++) {
    const user = await createRandomUser();
    users.push(user);
  }

  for (let i = 0; i < users.length - 1; i++) {
    await createFriendRequests(users[i], users[i + 1]);
  }
};
