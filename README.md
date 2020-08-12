## Getting Started

Before starting, make sure you have `php` installed.

Make sure to fill in all values in `basic.php`

## Auth0 Dashboard Config Options

In the 'API Explorer Application':

`Allowed Origins (CORS)` should include `http://localhost:3000`



In your Regular Web Application:

`Allowed Callback URLs` should include `http://localhost:3000/basic.php` 

`Allowed Logout URLs` should include `http://localhost:3000/basic.php` 


## Running the App

```bash
php -S localhost:3000
```

The app will be served at [http://localhost:3000/basic.php](http://localhost:3000/basic.php).

## Create a free account in Auth0

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.


