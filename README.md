# Medical-Records

## Do not mess with master

### Work only on the dev branch

### Routes
 * GET ```/``` -> Renders the home page
 * User authentication routes
   * GET ```/user/signup``` -> Renders the registration view
   * POST ```/user/signup``` -> Creation of new user account
   * GET ```/user/login``` -> Renders the login view
   * POST ```/user/login``` -> User login
   * GET ```/user/logout``` -> Logs the user out and redirects to ```/login``` route
   * GET ```/user/profile``` -> Renders the profile page
   * POST ```/user/profile/upload``` -> Uploads file to server and redirects to profile page after completion
   *  GET ```/user/verify/:id``` -> Verifies a user as one having a genuine email address from the link in user's inbox
### Installation 
(Note : These instructions are only for developers/testers for now)
1) Open git bash or cmd
2) Clone the repo: 
```
git clone https://github.com/knight-18/Medical-Records
```
3) Change to the **Medical-Records** directory
```
cd Medical-Records
```
4) Since the operational code is in the ```dev```, and the current branch is ```master```, checkout a tracking branch pointing to the ```dev``` of the remote repo (changes will get pulled automatically)
```
git checkout --track origin/dev
```
5) Obtain the **.env** file and place it inside the root (**Medical-Records**) directory
6) Open your git bash or cmd again, and cd to the **Medical-Records** directory. Then
```
npm install
```
After all packages have gotten installed, 
```
nodemon src/app.js
```

Web app will be accessible at ```localhost:3000```
