import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000; // Use environment variable or default to 3000
const __dirname = path.resolve();
app.use(cors()); // Uncomment if you're using CORS
app.use(helmet({
    contentSecurityPolicy: false,
  })); // helmet is a security middleware that helps you protect your app by setting various HTTP headers
app.use(morgan("dev")); // Enable logging
app.use(express.json()); // Call the function to use JSON parsing

/*app.get("/api/products", (req, res) => {
        //res.send("Hello from the backend test"); // Send response to the client
 //get all products from db
 res.status(200).json({success: true,  data:[ {id: 1, name: "Product 1"},{id: 2, name: "Product2" },{id: 3, name: "Product 3" }, ], }); 
});*/
// apply arcjet rate-limit to all routes
app.use(async (req, res, next) =>{});

app.use("/api/products", productRoutes);
if (process.env.NODE_ENV === "production") {
  // server our react app
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("/*splat", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html" ));
  });
}

app.use(async (req, res,next) =>{
    try{
     const decision = await aj.protect(req,{
        requested:1 // specifies that each request consumes 1 token
     })
     if(decision.isDenied()){
        if (decision.reason.isRateLimit()){
           res.status(429).json({ error: "Too Many Requests"});
        }else if (decision.reason.isBot()){
            res.status(403).json({ error: "Bot access denied"});
        }else {
            res.status(403).json({ error: "Forbidden"});
        }
        return
     }
     // check for spoofed bots
     if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())){
        res.status(403).json({ error: "Spoofed bot detected"});
        return; 
    }
    next()
    }catch (error){

    }
})

//app.use("/api/products", productRoutes);
app.get('/ping', (req, res) => {
    res.send('Server is up and running!');
});
async function initDB() {
    try{
      await sql`
      CREATE TABLE IF NOT EXISTS products(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
        console.log("Database initialized successfully");
    }catch (error)
    {
     console.log("Error initDB", error);
 
    }
}
initDB().then(() => {
    //app.listen(PORT, () => {
        //console.log("Server is running on port " + PORT);
   // });
    app.listen(PORT, '0.0.0.0', () => {
       console.log(`Server running on port ${PORT}`);
    });
}

) 

/*app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});*/
