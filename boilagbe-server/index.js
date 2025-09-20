const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const nodemailer = require('nodemailer')
const http = require('http')
const { Server } = require('socket.io')

const port = process.env.PORT || 5000
const ADMIN_EMAIL = "mehedihasansagor301@gmail.com";

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins or specify your frontend URL
    methods: ['GET', 'POST']
  }
})

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
    const messagesCollection = client.db('boiLagbe').collection('messages')
    const ordersCollection = client.db('boiLagbe').collection('orders')
    const feedbackCollection = client.db('boiLagbe').collection('feedbacks')

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

    // Feedbacks
    app.get('/feedbacks', async (req, res) => {
      const feedbacks = await feedbackCollection.find({}).sort({ _id: -1 }).toArray();
      res.send(feedbacks);
    });

    app.post('/feedbacks', async (req, res) => {
      const feedback = req.body;
      const result = await feedbackCollection.insertOne(feedback);
      res.send({ ...feedback, _id: result.insertedId });
    });

    app.patch('/feedbacks/:id/like', async (req, res) => {
      const id = req.params.id;
      await feedbackCollection.updateOne({ _id: new ObjectId(id) }, { $inc: { likes: 1 } });
      res.send({ success: true });
    });

    app.patch('/feedbacks/:id/reply', async (req, res) => {
      const id = req.params.id;
      const { reply } = req.body;
      await feedbackCollection.updateOne({ _id: new ObjectId(id) }, { $push: { replies: reply } });
      res.send({ success: true });
    });

    app.patch('/feedbacks/:id/reply-love', async (req, res) => {
      const id = req.params.id;
      const { replyIndex } = req.body;
      const feedback = await feedbackCollection.findOne({ _id: new ObjectId(id) });
      if (!feedback || !feedback.replies || feedback.replies.length <= replyIndex) return res.send({ success: false });
      feedback.replies[replyIndex].loves = (feedback.replies[replyIndex].loves || 0) + 1;
      await feedbackCollection.updateOne({ _id: new ObjectId(id) }, { $set: { replies: feedback.replies } });
      res.send({ success: true });
    });

    // Chat Section with Socket.io
    // Chat section starts
    app.get('/get-chats/:userId', async (req, res) => {
      const currentUserId = req.params.userId;
      try {
        // Get current user
        const currentUser = await userCollection.findOne({ _id: new ObjectId(currentUserId) });
        if (!currentUser) return res.status(404).json([]);
        // If admin, show all users except self
        if (currentUser.email === ADMIN_EMAIL) {
          const users = await userCollection.find({ email: { $ne: ADMIN_EMAIL } }).toArray();
          // For admin, show all users as chat list
          return res.status(200).json(users.map(u => ({
            userName: u.name,
            email: u.email,
            photoURL: u.photoURL,
            lastMessage: '',
            timestamp: '',
            isRead: false
          })));
        } else {
          // For buyers, only show admin as chat user
          const adminUser = await userCollection.findOne({ email: ADMIN_EMAIL });
          if (!adminUser) return res.status(404).json([]);
          return res.status(200).json([
            {
              userName: adminUser.name,
              email: adminUser.email,
              photoURL: adminUser.photoURL,
              lastMessage: '',
              timestamp: '',
              isRead: false
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching users and last messages:', error);
        return res.status(500).json({ message: 'Server error.' });
      }
    })

    app.get('/messages', async (req, res) => {
      try {
        const { sender, receiver, unreadOnly, lastOnly } = req.query;

        // Return only the last message if lastOnly=true
        if (lastOnly === "true") {
          const lastMessage = await messagesCollection
            .find({
              $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
              ]
            })
            .sort({ timestamp: -1 })
            .limit(1)
            .toArray();
          return res.json(lastMessage);
        }

        let query = {
          $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender }
          ]
        };

        if (unreadOnly === "true" && receiver) {
          query = {
            sender,
            receiver,
            $or: [
              { lastReadTimestamp: { $exists: false } },
              { $expr: { $lt: ["$lastReadTimestamp", "$timestamp"] } }
            ]
          };
        }

        const messages = await messagesCollection
          .find(query)
          .sort({ timestamp: 1 })
          .toArray();

        res.json(messages);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' })
      }
    })

    app.delete('/messages/:id', async (req, res) => {
      try {
        const messageId = req.params.id

        const result = await messagesCollection.deleteOne({
          _id: new ObjectId(messageId)
        })

        if (result.deletedCount === 1) {
          res.json({ success: true, message: 'Message deleted successfully' })
        } else {
          res.status(404).json({ success: false, error: 'Message not found' })
        }
      } catch (error) {
        res
          .status(500)
          .json({ success: false, error: 'Failed to delete message' })
      }
    })

    app.post('/messages/mark-read', async (req, res) => {
      const { sender, receiver } = req.body;
      await messagesCollection.updateMany(
        { sender, receiver, $or: [
          { lastReadTimestamp: { $exists: false } },
          { lastReadTimestamp: { $lt: new Date() } }
        ] },
        { $set: { lastReadTimestamp: new Date() } }
      );
      res.json({ success: true });
    });

    // Save order (cart + payment info) to DB
    app.post('/orders', async (req, res) => {
      try {
        const order = req.body;
        const result = await ordersCollection.insertOne(order);
        res.json({ success: true, insertedId: result.insertedId });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to save order' });
      }
    });

    // Get orders for a user
    app.get('/orders/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const orders = await ordersCollection.find({ userEmail: email }).sort({ orderDate: -1 }).toArray();
        res.json(orders);
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch orders' });
      }
    });

    io.on('connect', socket => {
      socket.on('authenticate', userId => {
        socket.join(userId.toString())
      })

      socket.on('sendMessage', async data => {
        try {
          console.log('Received sendMessage:', data);
          if (!data.sender || !data.receiver || !data.text) {
            console.error('Missing sender, receiver, or text in message:', data);
            return;
          }
          const message = {
            sender: data.sender,
            text: data.text,
            receiver: data.receiver,
            timestamp: new Date()
          }
          const result = await messagesCollection.insertOne(message)
          if (!result.acknowledged) {
            console.error('Failed to insert message:', message)
            return;
          }
          console.log('Message inserted:', result.insertedId)
          io.to(data.receiver).emit('receiveMessage', { ...message, _id: result.insertedId })
        } catch (err) {
          console.error('Error in sendMessage handler:', err)
        }
      })
      socket.on('messageRead', async messageId => {
        try {
          await messagesCollection.updateOne(
            { _id: new ObjectId(messageId) },
            { $set: { lastReadTimestamp: new Date() } }
          )
        } catch (error) {
          console.error('Error updating message read status:', error)
        }
      })

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
      })
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

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
