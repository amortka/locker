#Locker
Simple locker app with security over ldap enabled.

##Authentication
First step is getting token which will be required for all further API calls. To get token send the **username** and **password** in basic authorization header. If credentials are valid the token will be returned:
```
{
    "token": "8224d1dd-044b-4197-b1e1-baf790cd7219",
    "valid": "2015-02-14T14:29:25.950Z",
    "user": "someuser@domain.com"
}
```

```
/items
    POST, role: admin
    GET, role: user //just for testing

/items/:item_id
	GET
	PUT
	DELETE

/users
	POST
	GET

/users/verify
	POST

/auth
/refreshToken
/notAuthenticated

```
