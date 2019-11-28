const { mongoose } = require('./server');
const bcrypt = require('bcrypt');
const config = require('../../config.json');

const objectId = mongoose.Schema.Types.ObjectId;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    default: '',
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    index: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    default: '',
    required: true,
    select: false,
  },
  loginEnable: {
    type: Boolean,
    required: false,
    default: true,
  },
  headerImage: {
    type: String,
    default: '',
    trim: true,
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  intro: {
    type: String,
    default: '',
    trim: true,
  },
},
{ timestamps: { createdAt: '_created', updatedAt: '_updated' } }
);


userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, config.SALT_ROUND).then((hashedPassword) => {
    this.password = hashedPassword;
    next();
  });
});

const commentSchema = mongoose.Schema({
  userId: {
    type: objectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: { createdAt: '_created', updatedAt: '_updated' } });

const postSchema = mongoose.Schema({
  title: {
    type: String,
    default: '',
    trim: true,
  },
  abstract: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: false,
    trim: true,
  },
  _deleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  comments: {
    type: Array,
    required: false,
    default: [],
    list: [{ type: objectId, ref: commentSchema }],
  },
},
{ timestamps: { createdAt: '_created', updatedAt: '_updated' } }
);


const relationshipSchema = mongoose.Schema({
  operatorId: {
    type: objectId,
    required: true,
  },
  aimId: {
    type: objectId,
    required: true,
  },
  type: {
    type: Number,
    min: 1,
    max: 2,
  },
}, { timestamps: { createdAt: '_created', updatedAt: '_updated' } });


const constant = {
  relationship: {
    type: {
      user_post: 1,
    },
  },
};

const imgSchema = mongoose.Schema({
  name: {
    type: String,
    default: '',
    trim: true,
  },
  url: {
    type: String,
    default: '',
    trim: true,
  } },
{ timestamps: { createdAt: '_created', updatedAt: '_updated' } }
);

module.exports = {
  UserSchema: mongoose.model('User', userSchema),
  PostSchema: mongoose.model('Post', postSchema),
  RelationshipSchema: mongoose.model('relationship', relationshipSchema),
  CommentSchema: mongoose.model('comments', commentSchema),
  ImageSchema: mongoose.model('image', imgSchema),
  constant,
};
