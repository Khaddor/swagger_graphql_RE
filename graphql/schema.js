// graphql/schema.js

const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLBoolean, GraphQLInt, GraphQLList } = require('graphql');
const Annonce = require('../models/annonces');
const User = require('../models/user-models');

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
      resolve(parent, args) {
        const newUser = new User(args);
        return newUser.save();
      },
    },
    createAnnonce: {
      type: AnnonceType,
      args: {
      },
      resolve(parent, args) {
      },
    },
    updateAnnonce: {
      type: AnnonceType,
      args: {
        id: { type: GraphQLID },
        titre: { type: GraphQLString },
        type: { type: GraphQLString },
        publication: { type: GraphQLBoolean },
        statut: { type: GraphQLString },
        description: { type: GraphQLString },
        prix: { type: GraphQLInt },
        photos: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parent, args) {
        return Annonce.findByIdAndUpdate(args.id, {
          $set: {
            titre: args.titre,
            type: args.type,
            publication: args.publication,
            statut: args.statut,
            description: args.description,
            prix: args.prix,
            photos: args.photos,
          },
        }, { new: true });
      },
    },
    deleteAnnonce: {
      type: AnnonceType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Annonce.findByIdAndRemove(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
