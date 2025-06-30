// controllers/passportController.js
const PassportApplication = require('../models/PassportApplication');

exports.createPassport = async (req, res) => {
  try {
    const app = await PassportApplication.create(req.body);
    return res.status(201).json(app);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }
};

//babbar code
// const createProduct = async (req, res) => {
//   try {
//     // 1) Pull fields out of req.body via destructuring
//     const { name, price, description, category } = req.body;

//     // 2) Build a new Mongoose model instance using those fields
//     const newProduct = new Product({ name, price, description, category });

//     // 3) Save that instance to MongoDB
//     await newProduct.save();

//     // 4) Respond with status 200 + the newly created document
//     res.status(200).json({ product: newProduct });
//   } catch (err) {
//     // 5) If anything goes wrong, send a 500
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error"
//     });
//   }
// };


exports.getPassports = async (req, res) => {
  try {
    const apps = await PassportApplication.find();
    return res.json(apps);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }
};

exports.getPassportById = async (req, res) => {
  try {
    const app = await PassportApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Not Found' });
    return res.json(app);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }
};

exports.updatePassport = async (req, res) => {
  try {
    const app = await PassportApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!app) return res.status(404).json({ error: 'Not Found' });
    return res.json(app);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }
};


// const updateProduct = async (req, res) => {
//   try {
//     console.log("PUT ki request aayi h");
    
//     const { id } = req.params;
//     const { name, price, description, category } = req.body;

//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       { name, price, description, category },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res.json({
//         message: "cannot find product"
//       });
//     }

//     res.status(200).json({
//       product: updatedProduct
//     });
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


exports.deletePassport = async (req, res) => {
  try {
    const app = await PassportApplication.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ error: 'Not Found' });
    return res.status(204).end();  // No content
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }
};
