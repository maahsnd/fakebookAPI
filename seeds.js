const { faker } = require('@faker-js/faker');
const User = require('./models/User');

async function createRandomUser() {
  const user = new User({
    _id: faker.database.mongodbObjectId(),
    username: faker.person.fullName()
  });
  await user.save();
  return user;
}

exports.createUsers = () => {
  faker.helpers.multiple(createRandomUser, {
    count: 5
  });
};
