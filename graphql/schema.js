// graphql/schema.js

const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLBoolean, GraphQLInt,GraphQLNonNull, GraphQLList } = require('graphql');
const Annonce = require('../models/annonces');
const User = require('../models/user-models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Add bcrypt for password hashing

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    nom: { type: GraphQLString },
    prenom: { type: GraphQLString },
    username: { type: GraphQLString },
    googleId: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString },
  },
});



const AnswerType = new GraphQLObjectType({
  name: 'Answer',
  fields: {
    text: { type: GraphQLString },
    username: { type: GraphQLString },
    date: { type: GraphQLString }, // You might want to use a specific GraphQL Date type
  },
});

const QuestionType = new GraphQLObjectType({
  name: 'Question',
  fields: {
    text: { type: GraphQLString },
    username: { type: GraphQLString },
    date: { type: GraphQLString }, // You might want to use a specific GraphQL Date type
    answers: { type: new GraphQLList(AnswerType) },
  },
});

const AnnonceType = new GraphQLObjectType({
  name: 'Annonce',
  fields: {
    id: { type: GraphQLID },
    titre: { type: GraphQLString },
    type: { type: GraphQLString },
    publication: { type: GraphQLBoolean },
    statut: { type: GraphQLString },
    description: { type: GraphQLString },
    prix: { type: GraphQLInt },
    photos: { type: new GraphQLList(GraphQLString) },
    date: { type: GraphQLString }, // You might want to use a specific GraphQL Date type
    questions: { type: new GraphQLList(QuestionType) },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve(parent, args) {
        return 'Hello, GraphQL!';
      },
    },
    getAnnonce: {
      type: AnnonceType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Annonce.findById(args.id);
      },
    },
    getAnnonces: {
      type: new GraphQLList(AnnonceType),
      resolve(parent, args) {
        return Annonce.find();
      },
    },
    getUser: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    getUsers: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find();
      },
    },
  
 
  },
});
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {

    userLogin: {
      type: new GraphQLObjectType({
        name: 'UserLogin',
        fields: {
          user: { type: UserType },
          token: { type: GraphQLString },
        },
      }),
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        try {
          // Find the user by email
          const user = await User.findOne({ email: args.email });

          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Compare the provided password with the stored hashed password
          const passwordsMatch = await bcrypt.compare(args.password, user.password);

          if (!passwordsMatch) {
            throw new Error('Invalid email or password');
          }

          // User authenticated, generate JWT token
          const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });

          // Return the user and token in the response
          return { user, token };
        } catch (error) {
          throw error;
        }
      },
    },

    addUser: {
      type: UserType,
      args: {
        nom: { type: GraphQLString },
        prenom: { type: GraphQLString },
        username: { type: GraphQLString },
        googleId: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        role: { type: GraphQLString },
      },
      async resolve(parent, args) {
        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(args.password, 10);

        // Create a new user instance with the hashed password
        const newUser = new User({
          nom: args.nom,
          prenom: args.prenom,
          username: args.username,
          googleId: args.googleId,
          password: hashedPassword, // Store the hashed password
          email: args.email,
          role: args.role,
        });

        // Save the user to the database
        return newUser.save();
      },
    },

        createAnnonce: {
          type: AnnonceType,
          args: {
            titre: { type: new GraphQLNonNull(GraphQLString) },
            type: { type: new GraphQLNonNull(GraphQLString) },
            statut: { type: new GraphQLNonNull(GraphQLString) },
            description: { type: new GraphQLNonNull(GraphQLString) },
            prix: { type: new GraphQLNonNull(GraphQLInt) },
            photos: { type: new GraphQLList(GraphQLString) },
          },
          resolve(parent, args) {
            const newAnnonce = new Annonce({
              titre: args.titre,
              type: args.type,
              statut: args.statut,
              description: args.description,
              prix: args.prix,
              photos: args.photos,
            });
            return newAnnonce.save();
          },
        },

        updateAnnonce: {
          type: AnnonceType,
          args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            titre: { type: GraphQLString },
            type: { type: GraphQLString },
            statut: { type: GraphQLString },
            description: { type: GraphQLString },
            prix: { type: GraphQLInt },
            photos: { type: new GraphQLList(GraphQLString) },
          },
          async resolve(parent, args) {
            const updatedAnnonce = await Annonce.findByIdAndUpdate(
                args.id,
                {
                  $set: {
                    titre: args.titre,
                    type: args.type,
                    statut: args.statut,
                    description: args.description,
                    prix: args.prix,
                    photos: args.photos,
                  },
                },
                { new: true }
            );
            return updatedAnnonce;
          },
        },

        deleteAnnonce: {
          type: AnnonceType,
          args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
          },
          async resolve(parent, args) {
            const deletedAnnonce = await Annonce.findByIdAndDelete(args.id);
            return deletedAnnonce;
          },
        },
      },
    });

    module.exports = new GraphQLSchema({
      query: RootQuery,
      mutation: Mutation,
    });

