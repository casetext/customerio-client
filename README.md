
# customerio-client
A Customer.IO client for Node.js that isn't awful.

# Install

```bash
npm install customerio-client
```

# API

## Client(siteid, apikey)
A client connection to the Customer.IO API.


**Parameters**

**siteid**:  *String*,  - Your Customer.IO site ID.

**apikey**:  *String*,  - Your Customer.IO API key.


### identify(customerid, email, data)
Set or update information about a user in the Customer.IO database.


**Parameters**

**customerid**:  *String*,  - The user's unique ID.

**email**:  *String*,  - The user's email address.

**data**:  *Object*,  - Metadata about the user.

**Returns**

*Promise*,  A promise resolved on success or rejected with error on failure.


### deleteUser(customerid)
Remove a user from the Customer.IO database.


**Parameters**

**customerid**:  *String*,  - The user's unique ID.

**Returns**

*Promise*,  A promise resolved on success or rejected with error on failure.


### track(customerid, name, data)
Send information about a user-generated event to the Customer.IO database.


**Parameters**

**customerid**:  *String*,  - The user's unique ID.

**name**:  *String*,  - The name of the event.

**data**:  *Object*,  - Any further metadata about the event.

**Returns**

*Promise*,  A promise resolved on success or rejected with error on failure.


# Development

```bash
git clone https://github.com/casetext/customerio-client
cd customerio-client
npm install
git checkout -b feature/my-branch
$EDITOR customerio-client.js
npm test
git commit -a
git push origin feature/my-branch
```

# Versions

- 0.1.0: Initial release.
