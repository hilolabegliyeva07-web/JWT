const express = require("express")
require("dotenv").config()
const cors = require("cors")
const productRouter = require("./router/product.routes")
const authRouter = require("./router/auth.routes")


const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
   
  // router

  app.use(productRouter)
  app.use(authRouter)

    app.listen(PORT, () => {
    console.log(`Server is running at: ${PORT}`);
    });
