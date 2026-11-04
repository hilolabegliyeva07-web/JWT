const { v4 } = require("uuid")
const { read_file, write_file } = require("../fs/api")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register = async ( req, res) => {
    try {
        const { username, email, password } = req.body 

        const users = read_file("data/auth.json")

        const foundedEmail = users.find((u) => u.email === email)

        if (foundedEmail) {
            return res.status(400).json({
                message: "Email already exist"
            })
        }


        const foundedUsername = users.find((u) => u.username === username)

        if (foundedUsername) {
            return res.status(400).json({
                message: "Username already exist"
            })
        }

        const hashed = await bcrypt.hash(password, 12)

        users.push({
            id: v4(),
            username,
            email,
            password: hashed,
            role: "user"
        })

        write_file("data/auth.json", users)
        res.status(201).json({
            message: "Registered"
        })

    } catch(error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

const login = async ( req, res) => {
    try {
        const { email, password } = req.body 

        const users = read_file("data/auth.json")

        const foundedEmail = users.find((u) => u.email === email)

        if (!foundedEmail) {
            return res.status(401).json({
                message: "User not founded"
            })
        }

      const comp = await bcrypt.compare(password, foundedEmail.password)

      if (comp) {
        const payload = {id: foundedEmail.id, email: foundedEmail.email, role: foundedEmail.role}
        const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "24h"})
        res.status(200).json({
            message: "Succesfully",
            token
        })
      } else {
        return res.status(400).json({
            message: "Wrong password"
        })
      }
      
        
    } catch(error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = {
    register,
    login
}