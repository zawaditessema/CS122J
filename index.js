import express from "express"
const app = express()
const port = process.env.port || 3000
app.use(express.static("public"))

// Define routes
app.get("/", (req, res) => {
  res.sendFile(path.resolve() + "/index.html")
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
