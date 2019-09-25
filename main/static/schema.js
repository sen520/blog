const { mongoose } = require('./server');
const bcrypt = require('bcrypt');
const config = require('../../config.json');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    select: false,
  },
  headerImage: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  intro: {
    type: String,
    trim: true,
  },
},
{ timestamps: { createdAt: '_created', updatedAt: '_updated' } }
);


userSchema.pre('save', function (next) {
  if (!this.isModified('password') || !this.isNew) {
    return next();
  }
  bcrypt.hash(this.password, config.SALT_ROUND).then((hashedPassword) => {
    this.password = hashedPassword;
    next();
  });
});

module.exports = {
  UserSchema: mongoose.model('User', userSchema),
};
