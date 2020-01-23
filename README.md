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
> [GET]https://wapi.darkcode.software/api/v1/event/
> example: curl -G https://wapi.darkcode.software/api/v1/event/ -d lat=40.742054 -d long=-73.769417 -d fields=name,venue -d distance=10 -d limit=2 -d sort=location
>
Get single event
> [GET]https://wapi.darkcode.software/api/v1/event/:id

Create event
> [POST]https://wapi.darkcode.software/api/v1/event/

Update event
> [PUT]https://wapi.darkcode.software/api/v1/event/:id

Delete event
> [DELETE]https://wapi.darkcode.software/api/v1/event/:id

### User API call endpoints

Get all users
> [GET]https://wapi.darkcode.software/api/v1/user/

Get single user
> [GET]https://wapi.darkcode.software/api/v1/user/:id

Create user
> [POST]https://wapi.darkcode.software/api/v1/user/

Update user
> [PUT]https://wapi.darkcode.software/api/v1/user/:id

Delete user
> [DELETE]https://wapi.darkcode.software/api/v1/user/:id

### Admin endpoints

Get Dashboard data
> [GET]https://wapi.darkcode.software/api/v1/admin/

Get all users
> [GET]https://wapi.darkcode.software/api/v1/admin/user/

Get single user
> [GET]https://wapi.darkcode.software/api/v1/admin/user/:id

Register
> [POST]https://wapi.darkcode.software/api/v1/admin/register

Get all events
> [GET]https://wapi.darkcode.software/api/v1/admin/event/

Get single event
> [GET]https://wapi.darkcode.software/api/v1/admin/event/:id

#### Data mining endpoints
> [HTTP GET]https://wapi.darkcode.software/api/v1/admin/mine/
> [SOCKET GET]https://wapi.darkcode.software/api/v1/admin/socket/:message

