import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from 'passport-local';
const { Pool } = pg;
import 'dotenv/config';

const app = express();
const port = 4000;
const saltRounds = 10;

// Change to your own database
// Windows setup
const db = new Pool({
    user: "postgres",
    host: "localhost",
    database: "keeper",
    password: "dbpassword123",
    port: 5432,
});
// Linux setup
// const db = new Pool({
//     user: "localhost",
//     host: "localhost",
//     database: "keeper",
//     password: "dbpassword123",
//     port: 5433,
// });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// Configure session handling using express-session
app.use(
    session({
        secret: process.env.PASSPORT_SECRET, // Secret used to sign the session ID cookie
        resave: false, // Do not save session if unmodified
        saveUninitialized: false, // Do not create a session until something is stored
        cookie: {
            maxAge: 3600000, // Session expiration time in milliseconds
            // secure: true, // Only transmit over HTTPS
            // httpOnly: true, // Restrict access from JavaScript
            // sameSite: 'strict' // Control cross-origin cookie usage
        },
    })
);
 
// Initialize Passport and use Passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Check if email exists in the database
const emailExists = async (email) => {
    // Query the database to check if the email exists
    const data = await query("SELECT * FROM users WHERE email=$1", [email]);
   
    // Return the user data if found, otherwise return false
    if (data.rowCount == 0) return false;
    return data.rows[0];
};

const usernameExists = async (username) => {
    // Query the database to check if the email exists
    const data = await query("SELECT * FROM users WHERE username=$1", [username]);
   
    // Return the user data if found, otherwise return false
    if (data.rowCount == 0) return false;
    return data.rows[0];
}

// Create a new user in the database
const createUser = async (username, email, password, date_of_birth, gender) => {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
   
    // Get the current time
    const currentTime = new Date().toISOString();
   
    // Insert the new user into the database and return the user data
    const data = await query(
        "INSERT INTO users(username, email, password, date_of_birth, gender, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, username, email, date_of_birth, gender, role, created_at, updated_at",
        [username, email, hash, date_of_birth, gender, "user", currentTime, currentTime]
    );
   
    // Return the newly created user
    if (data.rowCount == 0) return false;
    return data.rows[0];
};
 
// Match entered password with the hashed password from the database
const matchPassword = async (password, hashPassword) => {
    // Compare the entered password with the hashed password
    const match = await bcrypt.compare(password, hashPassword);
    return match
};
 
// Passport strategy for user registration
passport.use("local-register", new LocalStrategy({ passReqToCallback: true }, async (req, email, password, done) => {
    try {
        const { date_of_birth, gender, username } = req.body;
        email = req.body.email

        // Check if the user already exists
        const isEmail = await emailExists(email);
        const isUsername = await usernameExists(username);
 
        // If user or email exists, return with message
        if (isEmail) {
            return done(null, false, {message: "Email is already in use"});
        }
        if(isUsername) {
            return done(null, false, {message: "Username is already in use"});
        }
 
        // Create a new user and return the user object
        const user = await createUser(username, email, password, date_of_birth, gender);
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));
 
// Passport strategy for user login
passport.use("local-login", new LocalStrategy(async (email, password, done) => {
    try {
        // Find the user in the database
        const user = await emailExists(email);
        const messageText = "Incorrect email or password";
        
        // If user doesn't exist, return message
        if (!user) return done(null, false, {message: messageText});
        
        // Check if the password matches
        const isMatch = await matchPassword(password, user.password);
        
        // Return user object if password matches, otherwise return message
        if (!isMatch) return done(null, false, {message: messageText});
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));
 
// Serialize user information for session management
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user information for session management
passport.deserializeUser(async (id, done) => {
    try {
        // Find the user by ID and return the user object
        const response = await query('SELECT * FROM users WHERE id = $1', [id]);
        const user = response.rows[0];
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});

/**
 * Function to make database queries
 * @param {*} sql query string
 * @param {*} params query parameters
 * @returns query result
 */
async function query(sql, params) {
    const client = await db.connect();
    try {
        // remove the logs later
        if (params) {
            console.log("SQL:", sql, params);
            return await client.query(sql, params);
        } else {
            console.log("SQL:", sql);
            return await client.query(sql);
        }
    } finally {
        client.release(); 
    }
}

let notes = [];

// Registration form submission route
app.post('/register', function(req, res, next) {
    console.log(req.body);
    passport.authenticate('local-register', function(err, email, info) {
      if (err) { return next(err); }
      if (!email) { 
        res.send(info.message);
        return;
      }

    })(req, res, next);
});

// Logout route
app.get("/logout",(req,res)=>{
    res.clearCookie("connect.sid"); // Clear the cookies left on client-side
    req.logOut(()=>{
        res.redirect("/"); // Redirect to the home page after logout
    });
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/addNote', (req, res) => {
    const note = req.body;
    notes.push(note);
    console.log(note);
});

app.post('/deleteNote', (req, res) => {
    const note = req.body;
    notes = notes.filter((note) => note.id !== note.id);
    console.log(note);
});

app.post('/editNote', (req, res) => {
    const note = req.body;
    notes = notes.map((note) => (note.id === note.id ? note : note));
    console.log(note);
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
