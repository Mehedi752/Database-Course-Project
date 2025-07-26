const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const nodemailer = require('nodemailer')

const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD
      }
    })

    const mailOptions = {
      from: `"BoiLagbe" <${process.env.EMAIL_SENDER}>`,
      to,
      subject,
      html: htmlContent
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully')
  } catch (error) {
    console.error('❌ Failed to send email:', error)
  }
}

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xk6aw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function run () {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )

    const userCollection = client.db('boiLagbe').collection('users')
    const bookCollection = client.db('boiLagbe').collection('books')
    const cartCollection = client.db('boiLagbe').collection('carts')

    //Users Related API
    app.post('/users', async (req, res) => {
      const user = req.body
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: 'User already exists' })
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    app.get('/users', async (req, res) => {
      const users = await userCollection.find({}).toArray()
      res.send(users)
    })

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const user = await userCollection.findOne(query)
      res.send(user)
    })
    // User related API End.

    app.post('/books', async (req, res) => {
      const book = req.body
      const timestamp = new Date()
      book.timestamp = timestamp
      const result = await bookCollection.insertOne(book)
      res.send(result)
    })

    app.get('/books', async (req, res) => {
      const books = await bookCollection.find({}).toArray()
      res.send(books)
    })

    app.get('/books/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const book = await bookCollection.findOne(query)
      res.send(book)
    })

    app.get('/books/latest/topSix', async (req, res) => {
      const books = await bookCollection
        .find()
        .sort({ timestamp: -1 })
        .limit(6)
        .toArray()
      res.send(books)
    })

    app.get('/books/myAdded/:email', async (req, res) => {
      const userEmail = req.params.email
      const query = { ownerEmail: userEmail }
      const books = await bookCollection.find(query).toArray()
      res.send(books)
    })

    app.delete('/books/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await bookCollection.deleteOne(query)
      res.send(result)
    })

    app.put('/books/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const updatedBook = req.body
      const updateDoc = {
        $set: {
          title: updatedBook.title,
          author: updatedBook.author,
          genre: updatedBook.genre,
          condition: updatedBook.condition,
          editionYear: updatedBook.editionYear,
          basePrice: updatedBook.basePrice,
          finalPrice: updatedBook.finalPrice,
          phone: updatedBook.phone,
          location: updatedBook.location,
          description: updatedBook.description,
          image: updatedBook.image,
          timestamp: new Date() // Update the timestamp to the current time
        }
      }
      const result = await bookCollection.updateOne(query, updateDoc)
      res.send(result)
    })

    // Cart related API
    app.post('/cart', async (req, res) => {
      const cartItem = req.body
      const result = await cartCollection.insertOne(cartItem)
      res.send(result)
    })

    app.get('/cart/:buyerEmail', async (req, res) => {
      const buyerEmail = req.params.buyerEmail
      const query = { buyerEmail: buyerEmail }
      const cartItems = await cartCollection.find(query).toArray()
      res.send(cartItems)
    })

    app.post('/confirm-payment', async (req, res) => {
      const { email, paymentMethod, transactionId, amount } = req.body
      console.log(
        `Confirming payment for ${email} with method ${paymentMethod} and transaction ID ${transactionId} for amount ৳${amount}`
      )

      try {
        const subject = '🧾 Your BoiLagbe Order Confirmation'

        const htmlContent = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <h2 style="color: #2c3e50;">📚 Thank You for Your Order!</h2>

    <p>Hi there,</p>

    <p>We're excited to let you know that your order has been <strong>successfully confirmed</strong>.</p>

    <h3 style="margin-top: 20px; color: #2980b9;">🧾 Order Summary</h3>
    <p><strong>💳 Payment Method:</strong> ${paymentMethod}</p>
    ${
      transactionId
        ? `<p><strong>🆔 Transaction ID:</strong> ${transactionId}</p>
           <p><strong>💰 Paid Amount:</strong> ৳${amount}</p>`
        : `<p><strong>💰 Amount Due:</strong> ৳${amount}</p>`
    }

    <p>🛍️ Our team has received your order and will begin processing it shortly. You’ll be notified once it's on the way!</p>

    <p>If you have any questions or need help, feel free to contact us at 
      <a href="mailto:${process.env.EMAIL_SENDER}" style="color: #2980b9;">${
          process.env.EMAIL_SENDER
        }</a>.
    </p>

    <p style="margin-top: 30px;">Thanks again for choosing <strong>BoiLagbe</strong>! 🚀</p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

    <div style="font-size: 0.9em; color: #444; line-height: 1.6;">
      <p style="margin: 0; font-weight: bold; font-size: 1rem;">📦 BoiLagbe Customer Support</p>
      <p style="margin: 0;">📞 <strong>Phone:</strong> <a href="tel:+8801234567890" style="color: #2980b9; text-decoration: none;">+880 1234-567890</a></p>
      <p style="margin: 0;">📍 <strong>Address:</strong> 123, Mirpur, Dhaka 1207, Bangladesh</p>
      <p style="margin-top: 8px; color: #888; font-size: 0.85em;">✉️ This is an automated message – please do not reply directly.</p>
    </div>
  </div>
`

        await sendEmail(email, subject, htmlContent)

        // Clear user's cart
        await cartCollection.deleteMany({ buyerEmail: email })

        res.status(200).json({ message: 'Payment confirmed and cart cleared.' })
      } catch (error) {
        console.error(error)
        res
          .status(500)
          .json({ error: 'Failed to confirm payment and send email.' })
      }
    })

    // Feedback section starts
    app.post('/feedbacks', async (req, res) => {
      const feedback = req.body
      const result = await feedbackCollection.insertOne(feedback)
      res.send(result)
    })

    app.get('/feedbacks', async (req, res) => {
      const feedbacks = await feedbackCollection.find({}).toArray()
      res.send(feedbacks)
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello Programmer!')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
