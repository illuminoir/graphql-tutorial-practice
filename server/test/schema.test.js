'use strict'

const { graphql } = require('graphql')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const typeDefs = require('../src/schema')
const resolvers = require('../src/resolvers')

let schema
let contextValue

const mockAuthor = {
    id: 'a_1',
    name: 'Mock Author',
    photo: 'mock-author.jpg'
}

const mockTrackBase = {
    id: 'c_0',
    title: 'Mock Track',
    thumbnail: 'mock-thumbnail.jpg',
    length: 100,
    modulesCount: 5,
    description: 'mock description',
    numberOfViews: 999,
    modules: [],
    authorId: mockAuthor.id,
    author: mockAuthor
}

beforeAll(() => {
    schema = makeExecutableSchema({ typeDefs, resolvers })

    contextValue = {
        dataSources: {
            trackAPI: {
                getTracksForHome: jest.fn(() => [mockTrackBase]),
                getTrack: jest.fn((id) => ({ ...mockTrackBase, id })),
                getAuthor: jest.fn(() => mockAuthor),
                getTrackModules: jest.fn(() => []),
                incrementTrackViews: jest.fn((trackId) => ({
                    // Return full Track object here to avoid null errors
                    id: trackId,
                    title: 'Mock Track',
                    thumbnail: 'mock-thumbnail.jpg',
                    length: 100,
                    modulesCount: 5,
                    description: 'mock description',
                    numberOfViews: 1000,
                    modules: [],
                    authorId: mockAuthor.id,
                    author: mockAuthor
                }))
            }
        }
    }
})

beforeEach(() => {
    jest.clearAllMocks()
})

describe('GraphQL Schema Validation', () => {
    describe('TracksForHome', () => {
        it('should fail: "thumb" does not exist on Track', async () => {
            const invalidQuery = `
        {
          tracksForHome {
            id
            thumb
          }
        }
      `
            const result = await graphql({ schema, source: invalidQuery, contextValue })
            expect(result.errors).toBeDefined()
        })

        it('should pass: valid query with all fields', async () => {
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
            const result = await graphql({ schema, source: validQuery, contextValue })
            expect(result.errors).toBeUndefined()
            expect(result.data?.tracksForHome).toBeDefined()
        })

        it('should pass: valid query with minimal fields', async () => {
            const validQuery = `
        {
          tracksForHome {
            id
            title
          }
        }
      `
            const result = await graphql({ schema, source: validQuery, contextValue })
            expect(result.errors).toBeUndefined()
        })
    })

    describe('Track', () => {
        it('should fail: field "thumb" does not exist on Track', async () => {
            const invalidQuery = `
        query Track($id: ID!) {
          track(id: $id) {
            id
            thumb
          }
        }
      `
            const result = await graphql({
                schema,
                source: invalidQuery,
                variableValues: { id: 'c_0' },
                contextValue
            })
            expect(result.errors).toBeDefined()
        })

        it('should pass: valid track query with all fields', async () => {
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
            const result = await graphql({
                schema,
                source: validQuery,
                variableValues: { id: 'c_0' },
                contextValue
            })
            expect(result.errors).toBeUndefined()
        })

        it('should pass: minimal valid track query', async () => {
            const validQuery = `
        query Track($id: ID!) {
          track(id: $id) {
            id
            title
          }
        }
      `
            const result = await graphql({
                schema,
                source: validQuery,
                variableValues: { id: 'c_0' },
                contextValue
            })
            expect(result.errors).toBeUndefined()
        })
    })

    describe('incrementTrackViews', () => {
        it('should pass: valid mutation', async () => {
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
            const result = await graphql({
                schema,
                source: mutation,
                variableValues: { id: 'c_01' },
                contextValue
            })
            expect(result.errors).toBeUndefined()
            expect(result.data.incrementTrackViews.track.id).toBe('c_01')
            expect(result.data.incrementTrackViews.track.numberOfViews).toBe(1000)
        })

        it('should fail: mutation with invalid field "views"', async () => {
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
            const result = await graphql({
                schema,
                source: mutation,
                variableValues: { id: 'c_01' },
                contextValue
            })
            expect(result.errors).toBeDefined()
        })
    })
})
