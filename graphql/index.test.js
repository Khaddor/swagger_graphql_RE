const { request: graphqlRequest } = require('graphql-request');
const { describe, it } = require("node:test");
const chai = require("chai");
const expect = chai.expect;

const serverUrl = 'http://localhost:3001/graphql';
const invalidUserId = '651c27b51653f141d0821458';
const invalidAnnonceId="651ec7440f63bb495e78889f"
let annonceToDelete = null;
let annonceToUpdate = null;

describe("GraphQL Queries and Mutations", () => {
    describe('Annonces', () => {
        it('should create a new annonce', async () => {
            const mutation = `
                mutation {
                    createAnnonce(
                        titre: "abklannouncement"
                        type: "vente"
                        statut: "disponible"
                        description: "aejfgiaefiaebfipuaebfpieabfogeafyoezgiofe"
                        prix: 50
                        photos: ["photo1.png", "photo2.png"]
                    ) {
                        id
                        titre
                        type
                        statut
                    }
                }
            `;
            try {
                const response = await graphqlRequest(serverUrl, mutation);

                expect(response).to.have.property('createAnnonce');
                expect(response.createAnnonce).to.have.property('id');
                expect(response.createAnnonce).to.have.property('titre', 'abklannouncement');
                expect(response.createAnnonce).to.have.property('type', 'vente');
                expect(response.createAnnonce).to.have.property('statut', 'disponible');

                annonceToDelete = response.createAnnonce.id;
                annonceToUpdate = response.createAnnonce.id;
            } catch (error) {
                console.error('Error during GraphQL request:', error);
                throw error;
            }
        });

        it('should update an existing annonce', async () => {
            const mutation = `
                mutation {
                    updateAnnonce(id: "${annonceToUpdate}", titre: "newabkl") {
                        id
                        titre
                    }
                }
            `;

            try {
                const response = await graphqlRequest(serverUrl, mutation);
                expect(response).to.have.property('updateAnnonce');
                expect(response.updateAnnonce).to.have.property('id');
                expect(response.updateAnnonce).to.have.property('titre', 'newabkl');
            } catch (error) {
                console.error('Error during GraphQL request:', error);
                throw error;
            }
        });

        it('should delete an existing annonce', async () => {
            const mutation = `
                mutation {
                    deleteAnnonce(id: "${annonceToDelete}") {
                        id
                        titre
                    }
                }
            `;

            try {
                const response = await graphqlRequest(serverUrl, mutation);

                expect(response).to.have.property('deleteAnnonce');
                expect(response.deleteAnnonce).to.have.property('id');
                expect(response.deleteAnnonce).to.have.property('titre');
            } catch (error) {
                console.error('Error during GraphQL request:', error);
                throw error;
            }
        });
    });

    describe('Users', () => {
        it('should get a list of users', async () => {
            const query = `
                query {
                    getUsers {
                        id
                        username
                    }
                }
            `;

            try {
                const response = await graphqlRequest(serverUrl, query);

                expect(response).to.have.property('getUsers');
                expect(response.getUsers).to.be.an('array');

                if (response.getUsers.length > 0) {
                    const firstUser = response.getUsers[0];
                    expect(firstUser).to.have.property('id');
                    expect(firstUser).to.have.property('username');
                }

            } catch (error) {
                console.error('Error during GraphQL request:', error);
                throw error;
            }
        });

        it('should get a specific user by ID', async () => {
            // Assuming the user ID is available in the database
            const userId = '65134e76fb93b5cbd98d40a9';

            const query = `
                query {
                    getUser(id: "${userId}") {
                        id
                        username
                        role
                    }
                }
            `;

            try {
                const response = await graphqlRequest(serverUrl, query);

                expect(response).to.have.property('getUser');
                expect(response.getUser).to.have.property('id', userId);
                expect(response.getUser).to.have.property('username');
                expect(response.getUser).to.have.property('role');

            } catch (error) {
                console.error('Error during GraphQL request:', error);
                throw error;
            }
        });

        it('should not get a specific user with invalid id', async () => {
            const query = `
                query {
                    getUser(id: "${invalidUserId}") {
                        id
                        username
                        role
                    }
                }
            `;

            try {
                const response = await graphqlRequest(serverUrl, query);
                expect(response).to.have.property('getUser').that.is.null;
            } catch (error) {
                console.error('Error during GraphQL request:', error);
                throw error;
            }
        });
    });

    it('should get a list of annonces', async () => {
        const query = `
                query {
                    getAnnonces {
                        id
                        titre
                        type
                        statut
                    }
                }
            `;

        try {
            const response = await graphqlRequest(serverUrl, query);

            expect(response).to.have.property('getAnnonces');
            expect(response.getAnnonces).to.be.an('array');

            if (response.getAnnonces.length > 0) {
                const firstAnnonce = response.getAnnonces[0];
                expect(firstAnnonce).to.have.property('id');
                expect(firstAnnonce).to.have.property('titre');
                expect(firstAnnonce).to.have.property('type');
                expect(firstAnnonce).to.have.property('statut');
            }

        } catch (error) {
            console.error('Error during GraphQL request:', error);
            throw error;
        }
    });

    it('should get a specific annonce by ID', async () => {
        // Assuming the annonce ID is available in the database
        const annonceId = '651ec7440f63bb495e78889e';

        const query = `
                query {
                    getAnnonce(id: "${annonceId}") {
                        id
                        titre
                        type
                        statut
                    }
                }
            `;

        try {
            const response = await graphqlRequest(serverUrl, query);

            expect(response).to.have.property('getAnnonce');
            expect(response.getAnnonce).to.have.property('id', annonceId);
            expect(response.getAnnonce).to.have.property('titre','op');
            expect(response.getAnnonce).to.have.property('type','location');
            expect(response.getAnnonce).to.have.property('statut','disponible');

        } catch (error) {
            console.error('Error during GraphQL request:', error);
            throw error;
        }
    });

    it('should not get a specific annonce with invalid id', async () => {
        const query = `
                query {
                    getAnnonce(id: "${invalidAnnonceId}") {
                        id
                        titre
                        type
                        statut
                    }
                }
            `;

        try {
            const response = await graphqlRequest(serverUrl, query);
            expect(response).to.have.property('getAnnonce').that.is.null;
        } catch (error) {
            console.error('Error during GraphQL request:', error);
            throw error;
        }
    });
});

describe('Auth Mutations', () => {
    describe('userLogin', () => {
        it('should log in a user and return a token', async () => {
            const mutation = `
                mutation {
                    userLogin(email: "abkl@gmail.com", password: "abkl") {
                        user {
                            id
                            username
                        }
                        token
                    }
                }
            `;

            try {
                const response = await graphqlRequest(serverUrl, mutation);

                expect(response).to.have.property('userLogin');
                expect(response.userLogin).to.have.property('user');
                expect(response.userLogin.user).to.have.property('id');
                expect(response.userLogin.user).to.have.property('username');
                expect(response.userLogin).to.have.property('token');
            } catch (error) {
                console.error('Error during GraphQL request:', error);
                throw error;
            }
        });

        describe('addUser', () => {
            it('should create a new user', async () => {
                const mutation = `
                    mutation {
                        addUser(
                            nom: "John"
                            prenom: "Doe"
                            username: "johndoe"
                            password: "testpassword"
                            email: "john.doe@example.com"
                            role: "user"
                        ) {
                            id
                            username
                        }
                    }
                `;

                try {
                    const response = await graphqlRequest(serverUrl, mutation);

                    expect(response).to.have.property('addUser');
                    expect(response.addUser).to.have.property('id');
                    expect(response.addUser).to.have.property('username', 'johndoe');
                } catch (error) {
                    console.error('Error during GraphQL request:', error);
                    throw error;
                }
            });
        });
    });
});
