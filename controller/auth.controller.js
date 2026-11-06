const { v4 } = require("uuid");
const { read_file, write_file } = require("../fs/api");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailSender = require("../utils/email-sender");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const users = read_file("data/auth.json");

    const foundedEmail = users.find((u) => u.email === email);

    if (foundedEmail) {
      return res.status(400).json({
        message: "Email already exist",
      });
    }

    const foundedUsername = users.find((u) => u.username === username);

    if (foundedUsername) {
      return res.status(400).json({
        message: "Username already exist",
      });
    }

    const hashed = await bcrypt.hash(password, 12);

    const randomNumber = Array.from({ length: 6 }, () =>
      Math.round(Math.random() * 9),
    ).join("");

    console.log(Date.now());

    res.status(201).json({ message: "Registered" });

    users.push({
      id: v4(),
      username,
      email,
      password: hashed,
      role: "user",
      otp: randomNumber,
      otpTime: Date.now() + 120000,
    });

    write_file("data/auth.json", users);

    await emailSender(email, randomNumber);
    res.status(201).json({
      message: "Registered",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//

const verify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const users = read_file("data/auth.json");

    const foundedEmail = users.find((u) => u.email === email);

    if (!foundedEmail) {
      return res.status(400).json({
        message: "Email not found",
      });
    }

    if (foundedEmail.otp !== otp) {
      return res.status(400).json({
        message: "Wrong opt",
      });
    }

    if (Date.now() > foundedEmail.otpTime) {
      users.forEach((u) => {
        if (u.id === foundedEmail.id) {
          ((u.otp = ""), (u.otpTime = null));
        }
        write_file("data/auth.json", users);
      });
      return res.status(400).json({
        message: "Otp expired",
      });
    }

    const payload = {
      id: foundedEmail.id,
      email: foundedEmail.email,
      role: foundedEmail.role,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "20d",
    });

    write_file("data/auth.json", users);
    res.status(200).json({
      message: "Verified",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = read_file("data/auth.json");

    const foundedEmail = users.find((u) => u.email === email);

    if (!foundedEmail) {
      return res.status(401).json({
        message: "User not founded",
      });
    }

    const comp = await bcrypt.compare(password, foundedEmail.password);

    if (comp) {
      const randomNumber = Array.from({ length: 6 }, () =>
       Math.round(Math.random() * 9),
    ).join("");
      await emailSender(email, randomNumber);
      return res.status(200).json({
        message: "Succesfully",
      });
    } else {
      return res.status(400).json({
        message: "Wrong password",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  register,
  login,
  verify,
};
