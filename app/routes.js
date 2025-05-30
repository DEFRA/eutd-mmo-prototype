//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here
// Route for displaying the 'Check your answers' page
router.get('/gamma/transport/check-your-answers', function (req, res) {
  res.render('gamma/transport/check-your-answers', {
      data: req.session.data
  });
});


// Route for handling transport selection
router.post('/gamma/transport/transport-type', function (req, res) {
    const transportType = req.body['transport-type'];
  
    if (transportType === 'Truck') {
      res.redirect('/gamma/transport/transport-truck');
    } else if (transportType === 'Plane') {
      res.redirect('/gamma/transport/transport-plane');
    } else if (transportType === 'Train') {
      res.redirect('/gamma/transport/transport-train');
    } else if (transportType === 'Container vessel') {
      res.redirect('/gamma/transport/transport-container-vessel');
    } else {
      res.redirect('/gamma/transport/transport-type');  // Redirect back if no option selected

  }
});


// Route for handling truck transport
router.post('/gamma/transport/transport-truck', function (req, res) {
  req.session.data['truck-nationality'] = req.body['truck-nationality'];
  req.session.data['truck-registration'] = req.body['registration-number'];
  req.session.data['truck-departure'] = req.body['export-place'];
  req.session.data['freight-number'] = req.body['freight-number'];
  res.redirect('/gamma/transport/transport-documents');
});


router.get('/gamma/transport/transport-documents', function (req, res) {
  const editIndex = req.query.edit;
  const removeIndex = req.query.remove;

  let documentNames = req.session.data['documentName[]'] || [];
  let referenceNumbers = req.session.data['referenceNumber[]'] || [];

  // Handle removal
  if (removeIndex !== undefined) {
    documentNames.splice(removeIndex, 1);
    referenceNumbers.splice(removeIndex, 1);
    req.session.data['documentName[]'] = documentNames;
    req.session.data['referenceNumber[]'] = referenceNumbers;
    return res.redirect('/gamma/transport/transport-additional');
  }

  // Handle editing
  if (editIndex !== undefined) {
    res.render('gamma/transport/transport-documents', {
      data: req.session.data,
      editIndex: editIndex,
      editDocumentName: documentNames[editIndex],
      editReferenceNumber: referenceNumbers[editIndex]
    });
  } else {
    res.render('gamma/transport/transport-documents', {
      data: req.session.data
    });
  }
});



router.post('/gamma/transport/transport-additional', function (req, res) {
  let documentNames = req.session.data['documentName[]'] || [];
  let referenceNumbers = req.session.data['referenceNumber[]'] || [];

  const name = req.body['documentName[]'];
  const ref = req.body['referenceNumber[]'];
  const editIndex = req.body.editIndex;

  if (editIndex !== undefined && editIndex !== '') {
    documentNames[editIndex] = name;
    referenceNumbers[editIndex] = ref;
  } else {
    if (Array.isArray(name)) {
      documentNames.push(...name);
      referenceNumbers.push(...ref);
    } else {
      documentNames.push(name);
      referenceNumbers.push(ref);
    }
  }

  req.session.data['documentName[]'] = documentNames;
  req.session.data['referenceNumber[]'] = referenceNumbers;
  req.session.data['additional-modes'] = req.body['additional-modes'];

  const additionalModes = req.body['additional-modes'];
  if (additionalModes === 'Yes') {
    res.redirect('/gamma/transport/transport-type');
  } else if (additionalModes === 'No') {
    res.redirect('/gamma/progress-complete');
  } else {
    res.redirect('/gamma/transport/transport-additional');
  }
});




// Route for exporter details
router.post('../gamma/add-products', function (req, res) {
  req.session.data['exporter-name'] = req.body['exporter-name']
  req.session.data['company-name'] = req.body['exporter-name']
  // Add more fields as needed
  res.redirect('../gamma/add-products')
})



// Route for landing details
router.post('../gamma/add-landings', function (req, res) {
  const session = req.session.data;

  // Save form fields to session
  session['startDateDay'] = req.body['startDateDay'];
  session['startDateMonth'] = req.body['startDateMonth'];
  session['startDateYear'] = req.body['startDateYear'];

  session['day'] = req.body['dateLandedDay'];
  session['month'] = req.body['dateLandedMonth'];
  session['year'] = req.body['dateLandedYear'];

  session['faoArea'] = req.body['faoArea'];
  session['highSeas'] = req.body['highSeas'];
  session['eez'] = req.body['eez'];
  session['rfmo'] = req.body['rfmo'];
  session['vessel'] = req.body['vessel'];
  session['weight'] = req.body['weight'];
  session['gear1'] = req.body['gear1'];
  session['gear2'] = req.body['gear2'];

  // Redirect to the next step
  res.redirect('../gamma/catch-waters');
});


  // Route for export journey


 router.post('../gamma/catch-waters', function (req, res) {
  req.session.data['waters'] = req.body['waters']; // This will be an array if multiple checkboxes are selected
  res.redirect('../gamma/export-journey');
});

router.post('../gamma/progress', function (req, res) {
  req.session.data['waters'] = req.body['waters'];
  res.redirect('../gamma/progress');
});

router.post('../gamma/export-journey', function (req, res) {
  req.session.data['waters'] = req.body['waters'];
  res.redirect('../gamma/export-journey');
});

  // Route for plane transport

router.post('../gamma/progress', function (req, res) {
  req.session.data['departure-country'] = req.body['departure-country'];
  req.session.data['destination-country'] = req.body['destination-country'];
  res.redirect('../gamma/progress');
});

router.post('../gamma/transport/transport-type', function (req, res) {
  req.session.data['departure-country'] = req.body['departure-country'];
  req.session.data['destination-country'] = req.body['destination-country'];
  res.redirect('../gamma/transport/transport-type');
});

router.post('../gamma/progress', function (req, res) {
  req.session.data['flight-number'] = req.body['flight-number'];
  req.session.data['plane-departure'] = req.body['plane-departure'];
  req.session.data['container-identification'] = req.body['container-identification']; // single value
  req.session.data['freight-bill'] = req.body['freight-bill'];
  res.redirect('../gamma/progress');
});

router.post('../gamma/transport/transport-documents-plane', function (req, res) {
  req.session.data['flight-number'] = req.body['flight-number'];
  req.session.data['plane-departure'] = req.body['plane-departure'];
  req.session.data['container-identification'] = req.body['container-identification']; // single value
  req.session.data['freight-bill'] = req.body['freight-bill'];
  res.redirect('../gamma/transport/transport-documents-plane');
});

router.post('../gamma/transport/check-your-answers', function (req, res) {
  // You could log, save, or simulate submission here
  console.log('Final submission:', req.session.data);

  // Redirect to a confirmation page
  res.redirect('../gamma/catch-certificate-complete');
});

router.get('../gamma/catch-certificate-complete', function (req, res) {
  res.render('../gamma/catch-certificate-complete');
});


