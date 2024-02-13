import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import "dotenv/config";
import db from "./database.js";
import jwt from "jsonwebtoken";
import auth from "./auth/auth.js";

const app = express();
const port = 4000;
const saltRounds = 10;

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
  const data = await query("SELECT * FROM users WHERE email=$1", [email]);

  if (data.rowCount == 0) return false;
  return data.rows[0];
};

const usernameExists = async (username) => {
  const data = await query("SELECT * FROM users WHERE username=$1", [username]);

  if (data.rowCount == 0) return false;
  return data.rows[0];
};

// Create a new user in the database
const createUser = async (username, email, password, date_of_birth, gender) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  const currentTime = new Date().toISOString();

  const data = await query(
    "INSERT INTO users(username, email, password, date_of_birth, gender, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, username, email, date_of_birth, gender, role, created_at, updated_at",
    [
      username,
      email,
      hash,
      date_of_birth,
      gender,
      "user",
      currentTime,
      currentTime,
    ]
  );

  if (data.rowCount == 0) return false;
  return data.rows[0];
};

// Match entered password with the hashed password from the database
const matchPassword = async (password, hashPassword) => {
  const match = await bcrypt.compare(password, hashPassword);
  return match;
};

// Passport strategy for user registration
passport.use(
  "local-register",
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const { date_of_birth, gender, username } = req.body;
        email = req.body.email;

        const isEmail = await emailExists(email);
        if (isEmail) {
          return done(null, false, { message: "Email is already in use" });
        }

        const isUsername = await usernameExists(username);
        if (isUsername) {
          return done(null, false, { message: "Username is already in use" });
        }

        const user = await createUser(
          username,
          email,
          password,
          date_of_birth,
          gender
        );
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Passport strategy for user login
passport.use(
  "local-login",
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await emailExists(email);

      const messageText = "Incorrect email or password";
      if (!user) return done(null, false, { message: messageText });

      const isMatch = await matchPassword(password, user.password);
      if (!isMatch) return done(null, false, { message: messageText });

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Serialize user information for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user information for session management
passport.deserializeUser(async (id, done) => {
  try {
    const response = await query("SELECT * FROM users WHERE id = $1", [id]);
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

// Registration form submission route
app.post("/register", function (req, res, next) {
  passport.authenticate("local-register", function (err, email, info) {
    if (err) {
      return next(err);
    }
    if (!email) {
      return res.status(400).json({ message: info.message });
    }
    res.json({ success: true, message: "Registration successful" });
  })(req, res, next);
});

// Login form submission route
app.post("/login", function (req, res, next) {
  passport.authenticate("local-login", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log("Authentication failed:", info.message); // Log authentication failure
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      const token = jwt.sign(
        {
          userId: user.id,
          userEmail: user.email,
          userRole: user.role,
        },
        process.env.TOKEN_PUBLIC_KEY,
        { expiresIn: "24h" }
      );

      console.log("Login successful"); // Log login success
      return res
        .status(200)
        .json({ success: true, message: "Login successful", user, token });
    });
  })(req, res, next);
});

// Get notes
app.get("/getNotes", auth, async (req, res) => {
  const userId = req.user.userId;
  if (userId === false) {
    res.status(400).json({ message: "User has no notes" });
    console.log("User has no notes");
    return;
  }
  const data = await query("SELECT * FROM notes WHERE user_id=$1", [userId]);
  if (data.rowCount == 0) return false;
  res.json(data.rows);
  return data.rows[0];
});

// Add note
app.post("/addNote", auth, async (req, res) => {
  let userId = req.user.userId;
  if (userId === false) {
    res.status(400).json({ message: "User not found" });
    console.log("User not found");
    return;
  }
  const data = await query(
    "INSERT INTO notes(user_id, title, content, color, created_at, updated_at, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, user_id, title, content, color, category",
    [
      userId,
      req.body.title,
      req.body.content,
      req.body.color,
      new Date(),
      new Date(),
      req.body.category,
    ]
  );
  if (data.rowCount == 0) return false;
  res.json(data.rows[0].id);
  return data.rows[0];
});

// Delete note
app.delete("/deleteNote/:id", auth, async (req, res) => {
  let userId = req.user.userId;
  if (userId === false) {
    res.status(400).json({ message: "User not found" });
    console.log("User not found");
    return;
  }
  const noteID = req.params.id;
  await query("DELETE FROM notes WHERE id=$1", [noteID]);
  res.status(204).send();
});

// Edit note
app.patch("/editNote/:id", auth, async (req, res) => {
  let userId = req.user.userId;
  if (userId === false) {
    res.status(400).json({ message: "User not found" });
    console.log("User not found");
    return;
  }
  const noteID = req.params.id;
  const data = await query(
    "UPDATE notes SET title=$1, content=$2, color=$3, updated_at=$4 WHERE id=$5 RETURNING id, title, content, color",
    [req.body.title, req.body.content, req.body.color, new Date(), noteID]
  );
  if (data.rowCount == 0) return false;
  res.json(data.rows[0]);
  return data.rows[0];
});

// Update on drag and drop
app.patch("/editCategory/:id", async (req, res) => {
  const noteID = req.params.id;
  const data = await query(
    "UPDATE notes SET category=$1, updated_at=$2 WHERE id=$3 RETURNING id, category",
    [req.body.category, new Date(), noteID]
  );
  if (data.rowCount == 0) return false;
  res.json(data.rows[0]);
  return data.rows[0];
});

// Update order on drag and drop
app.post("/editOrders", async (req, res) => {
  const notes = req.body;
  notes.forEach(async (note) => {
    const data = await query(
      "UPDATE notes SET category=$1, order_number=$2 WHERE id=$3",
      [note.category, note.order_number, note.id]
    );
  });
  return res.json([]);
});

// Get user for profile
app.get("/getUser", auth, async (req, res) => {
  const userID = req.user.userId;
  if (userID === false) {
    res.status(400).json({ message: "User not found" });
    console.log("User not found");
    return;
  }
  const data = await query("SELECT * FROM users WHERE id=$1", [userID]);
  if (data.rowCount == 0) return false;
  res.json(data.rows[0]);
  return data.rows[0];
});

// Get all users for admin
app.get("/getAllUsers", auth, async (req, res) => {
  const userID = req.user.userId;
  if (userID === false || req.user.userRole !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    console.log("Forbidden");
    return;
  }
  const data = await query("SELECT * FROM users");
  if (data.rowCount == 0) return false;

  // Iterate through each user and adjust the date_of_birth field
  data.rows.forEach((user) => {
    const databaseDate = new Date(user.date_of_birth + " UTC");
    user.date_of_birth = databaseDate.toISOString().split("T")[0];
  });

  res.json(data.rows);
  return data.rows;
});

// Update user information form admin
app.patch("/updateUser/:id", auth, async (req, res) => {
  const userID = req.user.userId;
  if (userID === false || req.user.userRole !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    console.log("Forbidden");
    return;
  }
  const currentTime = new Date();
  const data = await query(
    "UPDATE users SET username=$1, email=$2, date_of_birth=$3, gender=$4, role=$5, updated_at=$6 WHERE id=$7 RETURNING id, username, email, date_of_birth, gender, role",
    [
      req.body.username,
      req.body.email,
      req.body.date_of_birth,
      req.body.gender,
      req.body.role,
      currentTime,
      req.params.id,
    ]
  );
  if (data.rowCount == 0) return false;
  res.json(data.rows[0]);
  return data.rows[0];
});

// Delete user form admin
app.delete("/deleteUser/:id", auth, async (req, res) => {
  const userID = req.user.userId;
  if (userID === false || req.user.userRole !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    console.log("Forbidden");
    return;
  }
  await query("DELETE FROM notes WHERE user_id=$1", [req.params.id]);
  await query("DELETE FROM users WHERE id=$1", [req.params.id]);

  res.status(204).send();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
