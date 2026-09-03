export const typeDefs = /* GraphQL */ `
  enum Role {
    CUSTOMER
    PROVIDER
    ADMIN
  }

  enum BookingStatus {
    PENDING
    ACCEPTED
    DECLINED
    COMPLETED
  }

  type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
    role: Role!
  }

  type BookingEvent {
    id: ID!
    type: String!
    message: String
    actorId: String
    createdAt: String!
  }

  type Booking {
    id: ID!
    title: String!
    notes: String
    price: Float!
    status: BookingStatus!
    customer: User!
    provider: User!
    events: [BookingEvent!]!
    createdAt: String!
  }

  input CreateBookingInput {
    title: String!
    notes: String
    price: Float!
    providerId: ID!
  }

  type Query {
    me: User
    myBookings: [Booking!]!
    providerBookings(providerId: ID!): [Booking!]!
    allBookings: [Booking!]!
    booking(id: ID!): Booking
  }

  type Mutation {
    createBooking(input: CreateBookingInput!): Booking!
    acceptBooking(id: ID!): Booking!
    declineBooking(id: ID!): Booking!
    completeBooking(id: ID!): Booking!
  }
`;
