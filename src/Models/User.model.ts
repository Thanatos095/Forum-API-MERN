import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique : true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  },
  first_name: {
    type: String,
    required: true,
    minlength: 2
  },
  last_name: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type : String,
    required : true,
    validate: {
      validator: (value : String) => {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value as string);
      },
      message: 'validation/invalid-email-address'
    },
    unique : true,
    index: true,
  },
  dob: {
    type: Date,
    required: true,
  }
}, {timestamps : true});

export default mongoose.model('User', userSchema);
