# This is example application
You can test out this application for example with Postman.

It has no database connection. We recommend use for example typeorm for this purpose.

# Default settings
- App start at 3000 port
- Default paths:
    - GET:/users/myself
    - GET:/users/:id
- To authorize setup header:
  - `Authorize: Bearer token`
- Command to run app:
  - npm install && npm run start:dev