# Wakanda Software
Made with node v10.16.1
Requires Docker. Also requires pm2 to run in production mode
to start run: docker-compose up
to stop run: docker-compose down

# API Request
All endpoints are signed with the logged in user id and temp auth token received after successful login

> API Request Headers Params: 
> x-access-token: [Temp Auth JWT Token]
> X-Access-Id: [Logged In User ID]
> Content-Type: "application/x-www-form-urlencoded"

### Events API call endpoints

Get all events
> [GET]http://localhost:3001/api/v1/event/

Get single event
> [GET]http://localhost:3001/api/v1/event/:id

Create event
> [POST]http://localhost:3001/api/v1/event/

Update event
> [PUT]http://localhost:3001/api/v1/event/:id

Delete event
> [DELETE]http://localhost:3001/api/v1/event/:id

### User API call endpoints

Get all users
> [GET]http://localhost:3001/api/v1/user/

Get single user
> [GET]http://localhost:3001/api/v1/user/:id

Create user
> [POST]http://localhost:3001/api/v1/user/

Update user
> [PUT]http://localhost:3001/api/v1/user/:id

Delete user
> [DELETE]http://localhost:3001/api/v1/user/:id

### Admin endpoints

Get Dashboard data
> [GET]http://localhost:3001/api/v1/admin/

Get all users
> [GET]http://localhost:3001/api/v1/admin/user/

Get single user
> [GET]http://localhost:3001/api/v1/admin/user/:id

Register
> [POST]http://localhost:3001/api/v1/admin/register

Get all events
> [GET]http://localhost:3001/api/v1/admin/event/

Get single event
> [GET]http://localhost:3001/api/v1/admin/event/:id

#### Data mining endpoints
> [HTTP GET]http://localhost:3001/api/v1/admin/mine/
> [SOCKET GET]http://localhost:3001/api/v1/admin/socket/:message

