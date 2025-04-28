const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;

const ejsmate = require("ejs-mate");
const methodoverride = require("method-override");







// Connect to MongoDB
mongoose.connect('mongodb+srv://root:75oVFVy1VEs61kaV@cluster0.iwjyxik.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const today = new Date();

const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
const year = today.getFullYear();

const dd = `${day}-${month}-${year}`
console.log(dd)

// Define schema and model
const leadBuySchema = new mongoose.Schema({ category:String, dropdown: String,
  variant : String,
  phone:Number,
  
  date: {
    type: String,
    default: dd
  }
});

const Phone = mongoose.model('Buyleads', leadBuySchema);

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "assets")));
app.engine("ejs", ejsmate);
app.use(methodoverride("_method"));
app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + './views/pages/index.ejs');

// });

app.get("/", (req, res) => {
  res.render("pages/index");
});


// Route to handle submission
app.post('/submit', async (req, res) => {
  const catVal = req.body.category;
  const dropdownValue = req.body.dropdown;
  const Variantvalue = req.body.variant;
  const phoneNumber = req.body.phone;
  

  if (!/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Phone number must be exactly 10 digits.' });
  }

  try {
    const newBuyLeads = new Phone({ category:catVal, dropdown: dropdownValue,
      variant:Variantvalue,
      phone:phoneNumber,
    });
    await newBuyLeads.save();
    
    res.json({ message: 'Enquiry submitted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Try Again!' });
  }
});





// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
