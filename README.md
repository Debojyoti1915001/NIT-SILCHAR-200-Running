# NIT-SILCHAR-200-Running

## Do not mess with master

### Work only on the dev branch

### Routes
 * GET ```/``` -> Renders the Ecommerce Landing Page
 * User authentication routes
   * GET ```/user/signup``` -> Renders the registration view
   * POST ```/user/signup``` -> Creation of new user account
   * GET ```/user/login``` -> Renders the login view
   * POST ```/user/login``` -> User login
   * GET ```/user/logout``` -> Logs the user out and redirects to ```/login``` route
   * GET ```/user/groupLanding``` -> Renders the group Landing page i.e. the post of all the Groups you are part of.
   * GET ```/user/groupFeed``` -> Renders all the groups you are part of alng with the suggested Groups done using ML.
   * GET ```/user/homeGroup?id=``` -> Renders all the details within a group
   * GET ```/products``` -> Renders all the products
   * GET ```/suggestedProducts`` -> Renders all the suggested products done using ML
   

   
### Installation 
(Note : These instructions are only for developers/testers for now)
1) Open git bash or cmd
2) Clone the repo: 
```
git clone https://github.com/Debojyoti1915001/NIT-SILCHAR-200-Running.git
```
3) Change to the **NIT-SILCHAR-200-Running** directory
```
cd NIT-SILCHAR-200-Running
```
4) The operational code is in  ```master```
```
git checkout --track origin/dev
```
5) Obtain the **.env** file and place it inside the root (**NIT-SILCHAR-200-Running**) directory

```
MONGODB_URL=mongodb+srv://debo:debo@debo.brgyg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
NODEMAILER_EMAIL= enter_your_email_here
NODEMAILER_SECONDARYEMAIL=enter_your_secondary_email_here
NODEMAILER_PASSWORD = enter_your_email's_password_here
JWT_SECRET = seaoftranquility
Cloud_Name=dxjcjsopt
API_Key=776272262761276
API_Secret=ZvhJVjaKl4CTKyDJIN-xKfNOit4
```

6) Open your git bash or cmd again, and cd to the **NIT-SILCHAR-200-Running** directory. Then
```
npm install
```
After all packages have gotten installed, 
```
nodemon src/app.js
```

Web app will be accessible at ```localhost:3000```




