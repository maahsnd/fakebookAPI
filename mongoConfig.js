const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
main().catch((err) => console.log(err));
async function main() {
  try {
    let connection = await mongoose.connect(process.env.MONGO_STRING);
    console.log(`Successfully connected to MONGO`)  
  } catch (error) {
    console.errorR(error)
  }
}
