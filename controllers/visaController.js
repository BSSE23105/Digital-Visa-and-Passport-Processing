// controllers/visaController.js

// 1. Import the Mongoose model for visa applications.
//    This model provides methods like create(), find(), findById(), etc.
const VisaApplication = require('../models/VisaApplication');

/*
  2. CREATE A NEW VISA APPLICATION
  --------------------------------
  - Route handler for POST /visas
  - Expects visa data in req.body (JSON).
  - Creates a new document in MongoDB and returns it with status 201.
*/
exports.createVisa = async (req, res) => {
  try {
    // a) Use Mongoose’s create() to insert a new document into the VisaApplication collection.
    const app = await VisaApplication.create(req.body);
    // b) If successful, send a 201 Created status and return the newly created document as JSON.
    return res.status(201).json(app);
  } catch (err) {
    // c) If something goes wrong (validation error, DB offline, etc.), log the error and send a 500.
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }
};

/*
  3. GET ALL VISA APPLICATIONS
  ----------------------------
  - Route handler for GET /visas
  - Fetches all visa documents from MongoDB and returns them as an array.
*/
exports.getVisas = async (req, res) => {
  try {
    // a) Use find() without a filter to get every document in the collection.
    const apps = await VisaApplication.find();
    // b) Return the array of applications (status 200 is default for res.json).
    return res.json(apps);
  } catch (err) {
    // c) On error, log and respond with 500.
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }
};

/*
  4. GET A SINGLE VISA APPLICATION BY ID
  --------------------------------------
  - Route handler for GET /visas/:id
  - Looks up one document by its MongoDB ObjectId (req.params.id).
  - If found, returns it; if not, sends 404 Not Found.
*/
exports.getVisaById = async (req, res) => {
  try {
    // a) findById() returns null if no document matches.
    const app = await VisaApplication.findById(req.params.id);
    // b) If no document is found, send 404 and a simple JSON error message.
    if (!app) return res.status(404).json({ error: 'Not Found' });
    // c) If found, send it back as JSON (status 200 by default).
    return res.json(app);
  } catch (err) {
    // d) If something else goes wrong (invalid ID format, DB issues), send 500.
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }
};

/*
  5. UPDATE AN EXISTING VISA APPLICATION
  --------------------------------------
  - Route handler for PUT /visas/:id
  - Takes updated fields in req.body and applies them to the document with that ID.
  - Options:
  * new: true            → return the updated document instead of the old one.
  * runValidators: true  → run schema validators on the new data before saving.
*/
exports.updateVisa = async (req, res) => {
  try {
    const app = await VisaApplication.findByIdAndUpdate(
      req.params.id,       // which document to update
      req.body,            // the fields/values to update
      { new: true, runValidators: true }
    );
    // a) If no document matches that ID, send 404.
    if (!app) return res.status(404).json({ error: 'Not Found' });
    // b) If update succeeds, return the updated document.
    return res.json(app);
  } catch (err) {
    // c) On error (invalid data, wrong ID format, etc.), log and send 500.
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }
};

/*
  6. DELETE A VISA APPLICATION
  -----------------------------
  - Route handler for DELETE /visas/:id
  - Removes the document with the given ID from the database.
  - If successful, returns 204 No Content (no JSON body).
*/
exports.deleteVisa = async (req, res) => {
  try {
    const app = await VisaApplication.findByIdAndDelete(req.params.id);
    // a) If the document doesn’t exist, respond with 404.
    if (!app) return res.status(404).json({ error: 'Not Found' });
    // b) If deletion succeeds, send 204 No Content (client knows it’s gone).
    return res.status(204).end();
  } catch (err) {
    // c) If something goes wrong, log and respond with 500.
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }
};
