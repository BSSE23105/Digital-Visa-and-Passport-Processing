// routes/visaRoutes.js

// 1. Import Express’s router() so we can define endpoints
const router = require('express').Router();

// 2. Import all of the “visa” controller functions from controllers/visaController.js
//    These controller functions will actually handle the database logic, response sending, etc.
const ctrl = require('../controllers/visaController');

/*
  3. Define routes for the “root” path of this router, which will be '/visas' once you mount it in app.js.
     - GET  '/'      → ctrl.getVisas     (fetch a list of all visas)
     - POST '/'      → ctrl.createVisa   (create a brand-new visa entry)
*/
router
  .route('/')
  .get(ctrl.getVisas)      // When someone does GET /visas, run getVisas()
  .post(ctrl.createVisa);  // When someone does POST /visas, run createVisa()

/*
  4. Define routes for a specific visa ID. This path will be '/visas/:id’ once mounted.
     - GET    '/:id'        → ctrl.getVisaById   (fetch a single visa by its ID)
     - PUT    '/:id'        → ctrl.updateVisa    (update all fields of that visa)
     - DELETE '/:id'        → ctrl.deleteVisa    (remove that visa)
*/
router
  .route('/:id')
  .get(ctrl.getVisaById)  // GET /visas/123 → getVisaById(req, res) with req.params.id = 123
  .put(ctrl.updateVisa)   // PUT /visas/123 → updateVisa(req, res)
  .delete(ctrl.deleteVisa);// DELETE /visas/123 → deleteVisa(req, res)

/*
  5. Finally, export this router so that when you do `app.use('/visas', visaRoutes)`,
     all the routes above become active under the /visas path in your main app.
*/
module.exports = router;

