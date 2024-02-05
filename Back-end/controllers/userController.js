import UserSchema from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import { createToken, verifyToken } from "../utils/token.js";

// Sign up function
export const signup = async (req, res) => {
  const { name, email, role, photourl } = req.body;
  const generatedPassword = "random";
  const password = req.body.password || generatedPassword; //to handle wether a pass is provided by normal sign up or by google
  const picture = req.file.filename;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  try {
    const newUser = new UserSchema({
      name,
      email,
      password: hash,
      role,
      picture: picture,
      photourl,
    });
    await newUser.save();
    const token = createToken(newUser);
    const decoded = verifyToken(token);
    res
      .status(200)
      .cookie("userToken", token, {
        secure: true,
        httpOnly: true,
        sameSite: "None",
      })
      .json({ message: "user created successfully", token: decoded });
  } catch (err) {
    console.log(err);
    res.status(401).send("Something went wrong !");
  }
};
//Google Auth
export const gsignup = async (req, res) => {
  const { name, email, role, photourl } = req.body;
  const generatedPassword = "random";
  const password = req.body.password || generatedPassword;
  const picture = req.file;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  try {
    // handles an already authenticated account
    const user = await UserSchema.findOne({ email: email });
    if (user) {
      const token = createToken(user);
      const decoded = verifyToken(token);
      res
        .cookie("userToken", token, {
          secure: true,
          httpOnly: true,
          sameSite: "None",
        })
        .status(200)
        .json({ message: "user logged in successfully", token: decoded });
      //
    } else {
      const newUser = new UserSchema({
        name,
        email,
        password: hash,
        role,
        picture: picture,
        photourl,
      });
      await newUser.save();
      const token = createToken(newUser);
      const decoded = verifyToken(token);
      res
        .status(200)
        .cookie("userToken", token, {
          secure: true,
          httpOnly: true,
          sameSite: "None",
        })
        .json({ message: "user created successfully", token: decoded });
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Something went wrong !");
  }
};

// Log in function
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserSchema.findOne({ email: email });
  if (!user) {
    return res.status(401).send("user not found !");
  } else {
    try {
      if (await bcrypt.compare(password, user.password)) {
        const token = createToken(user);
        const decoded = verifyToken(token);
        res
          .cookie("userToken", token, {
            secure: true,
            httpOnly: true,
            sameSite: "None",
          })
          .status(200)
          .json({ message: "user logged in successfully", token: decoded });
      }
    } catch (error) {
      console.log(err);
    }
  }
};

//logout fct

export const logout = (req, res) => {
  console.log("cookie cleared");
  return res
    .clearCookie("userToken")
    .status(200)
    .send("successfully logged out");
};

// Fetch all users
export const getAll = async (req, res) => {
  try {
    const allUsers = await UserSchema.find();
    return res.status(200).json(allUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "cannot fetch users" });
  }
};

// Fetch one user by ID
export const getOne = async (req, res) => {
  const token = req.cookies.userToken;
  const decoded = verifyToken(token);
  const id = decoded.data?.id;
  try {
    if (!id) {
      return res.status(400).json({ error: "NO Token!!!!!!!" });
    }
    const user = await UserSchema.findById(id);
    if (user) {
      return res.json({
        Picture: user.picture,
        Role: user.role,
        id: user._id,
        name: user.name,
        photourl: user.photourl,
      });
    } else {
      return res.status(404).json({ error: "User Not Found!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Couldn't find user" });
  }
};

// Update user

export const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const { name, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    if (req.file) {
      await UserSchema.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name: name,
            email: email,
            password: hash,
            picture: req.file.filename,
          },
        }
      );
    } else {
      await UserSchema.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name: name,
            email: email,
            password: hash,
          },
        }
      );
    }
    return res.status(200).json({ message: "user updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Trouble updating user info" });
  }
};

// Delete user

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await UserSchema.deleteOne({ _id: id });
    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: " could not delete user" });
  }
};
