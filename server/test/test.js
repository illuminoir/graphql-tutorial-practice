'use strict'

const EasyGraphQLTester = require('easygraphql-tester');
const typeDefs = require('../src/schema');

describe('Test my queries, mutations and subscriptions', () => {
    let tester

    beforeAll(() => {
        tester = new EasyGraphQLTester(typeDefs)
    })

    describe('Should pass if the query is invalid', () => {
        describe('TracksForHome', () => {
            it('Invalid query tracksForHome, field "thumb" does not exist', () => {
                const invalidQuery = `
                    {
                      tracksForHome {
                        id
                        thumb
                      }
                    }
                  `
                // First arg: false, there is no invalidField on the schema.
                tester.test(false, invalidQuery)
            })

            it('Nominal case', () => {
                const validQuery = `
                        {
                          tracksForHome {
                            id
                            title
                            thumbnail
                            length
                            modulesCount
                            author {
                              id
                              name
                              photo
                            }
                          }
                        }
                      `
                tester.test(true, validQuery)
            })

            it('Nominal case with less fields', () => {
                const validQuery = `
                    {
                      tracksForHome {
                        id
                        title
                      }
                    }
                  `
                tester.test(true, validQuery)
            })
        })
        describe('Track', () => {
            it('Invalid query track, field "thumb" does not exist', () => {
                const invalidQuery = `
                    query Track($id: ID!) {
                      track(id: $id) {
                        id
                        thumb
                      }
                    }
                  `
                // First arg: false, there is no invalidField on the schema.
                tester.test(false, invalidQuery, {
                    id: "c_0",
                })
            })

            it('Nominal case', () => {
                const validQuery = `
                      query Track($id: ID!) {
                          track(id: $id) {
                            id
                            title
                            thumbnail
                            length
                            modulesCount
                            author {
                              id
                              name
                              photo
                            }
                          }
                      }
                      `
                tester.test(true, validQuery, {
                    id: "c_0",
                })
            })

            it('Nominal case with less fields', () => {
                const validQuery = `
                    query Track($id: ID!) {
                      track(id: $id) {
                        id
                        title
                      }
                    }
                  `
                tester.test(true, validQuery, {
                    id: "c_0",
                })
            })
        })
        describe('incrementTrackViews', () => {
            it('Nominal case', () => {
                const mutation = `
                    mutation incrementTrackViews($id: ID!) {
                      incrementTrackViews(id: $id) {
                        code
                        success
                        message
                        track {
                          id
                          numberOfViews
                        }
                      }
                    }
                  `
                tester.test(true, mutation, {
                    id: "c_01",
                })
            })
            it('Should not pass if one value on the mutation input is invalid (views is invalid)', () => {
                const mutation = `
                    mutation incrementTrackViews($id: ID!) {
                      incrementTrackViews(id: $id) {
                        code
                        success
                        message
                        track {
                          id
                          views
                        }
                      }
                    }
                  `
                // First arg: false, there is no invalidField on the schema.
                tester.test(false, mutation, {
                    id: "c_01"
                })
            })
        })
    })
})