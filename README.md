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
