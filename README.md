# Bowls Booking Back-end

### Overview

- Built and deployed using [Serverless](https://www.serverless.com/)
- _Serverless_ deploys routes via [AWS API Gateway](https://aws.amazon.com/api-gateway/)
- _Serverless_ deploys API handling via [AWS Lambda Functions](https://aws.amazon.com/lambda/)
- Database hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), configured to be on the same AWS region as Serverless deploys
- Testing the api in the early stages done using [Insomnia](https://insomnia.rest/) and _serverless-offline_ (a node module)

#### Initial data structure

Data that is stored on the MongoDB Atlas cloud must be structured appropriately using mongoose schema.

**Users:** name, email, password, date_registered
**Slots:** time_start, time_end, title, is_booked

All CRUD actions must be authorised appropriately, however this will be implemented at a later stage with administration privileges different from user privileges.

From here the front-end should be able to CRUD users and slots. Times and dates of slots will be set and ordered by the front-end too.

#### Automatic creation of slots

It's my intention for the Admin user to be able to set up slots that repeat/auto-generate. For example, overnight a function is triggered to generate a set of slots to be made available to book, or that are already reserved.

This will probably be handled by [AWS Cloudwatch](https://aws.amazon.com/cloudwatch/), which _Serverless_ supports.

## Build

#### Mongoose Models

User's are saved to the data base with information that pertains to authentication. The users ID value will also be entered when making booking entries in the database.
**User**

- name
- email
- password
- date_registered

Booking slots are the other form of entry in the database. Slots can be created, deleted and have bookings added and removed from them. Slots will have the following structure:
**Slot**

- title (Name given to the booking area ... "Rink One")
- startTime (a string, dateTime something or other, maybe UTC value)
- endTime
- booking (null be default - added as a sub-document)

  - userID (the ID of the user who made the booking)
  - bookingNames (a string entered by the user for displaying who is playing)
  - dateBooked (a time stamp of the moment when the booking was made)

Perhaps _bookingNames_ should default to the name of whoever makes the booking, avoiding extremely large entries when 4 players are using one rink.
Perhaps when prompted to enter the _bookingNames_ the user is provided with autocomplete options for registered users/members.

#### Handler.js

Imports `db.js` - this is important for AWS Lambda so that it recognises if a database connection is already established.
Here I've set out each action, which include MongDB queries/communications. Each of these is split into it's own Lambda function (i think...) and hooked up to the necessary API Gateway endpoints by Serverless. **Password encryptions and JTW validation to be added later.**

##### serverless.yml

Here is where I've set out all the config info that Serverless requires to do it's magic.

```yml
provider:
  name: aws
  runtime: nodejs12.x
  memorySize: 128 # set the maximum memory of the Lambdas in Megabytes
  timeout: 10 # the timeout is 10 seconds (default is 6 seconds)
  stage: dev # setting the env stage to dev, this will be visible in the routes
  region: eu-west-1
```

Then add all the "routes" in a simple fashion, the rest is handled by Serverless

```yml
functions: # add 4 functions for CRUD
  createUser:
    handler: handler.createUser # point to exported create function in handler.js
    events:
      - http:
          path: users # path will be domain.name.com/dev/users
          method: post
          cors: true
  getUser:
    handler: handler.getUser
    events:
      - http:
          path: users/{id} # path will be domain.name.com/dev/users/{user_id}
          method: get
          cors: true
```
