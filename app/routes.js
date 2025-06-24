//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here
// Route for displaying the 'Check your answers' page
router.get('/gamma/transport/check-your-answers', function (req, res) {
  const data = req.session.data;
  const groupedTransportTypes = getGroupedTransportTypes(data);
  res.render('gamma/transport/check-your-answers', {
    data,
    groupedTransportTypes
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

// Route for handling landings option selection
router.post('/gamma/landings-entry', function (req, res) {
  const landingsOption = req.body['landings-option'];

  if (landingsOption === 'dl' || landingsOption === 'manual') {
    res.redirect('/gamma/progress');
  } else if (landingsOption === 'upload') {
    res.redirect('/gamma/progress-csv');
  } else {
    res.redirect('/gamma/landings/landings-entry'); // Redirect back if no option selected
  }
});



// Route for handling truck transport
router.post('/gamma/transport/transport-truck', function (req, res) {
  req.session.data['truck-nationality'] = req.body['truck-nationality'];
  req.session.data['truck-registration'] = req.body['registration-number'];
  req.session.data['export-place'] = req.body['export-place'];
  req.session.data['freight-number'] = req.body['freight-number'];

  // Add to transportTypes array in session
  req.session.data['transportTypes'] = req.session.data['transportTypes'] || [];
  req.session.data['transportTypes'].push({
    type: 'Truck',
    truckNationality: req.body['truck-nationality'],
    truckRegistration: req.body['registration-number'],
    exportPlace: req.body['export-place'],
    freightBillNumber: req.body['freight-number']
  });
  res.redirect('/gamma/transport/transport-documents');
});

// Route for handling plane transport
router.post('/gamma/transport/transport-plane', function (req, res) {
  req.session.data['airway-bill'] = req.body['airway-bill'];
  req.session.data['flight-number'] = req.body['flight-number'];
  req.session.data['plane-departure'] = req.body['plane-departure'];
  req.session.data['container-identification'] = req.body['container-identification'];

  req.session.data['transportTypes'] = req.session.data['transportTypes'] || [];
  req.session.data['transportTypes'].push({
    type: 'Plane',
    flightNumber: req.body['flight-number'],
    planeDeparture: req.body['plane-departure'],
    airwayBill: req.body['airway-bill'],
    containerIdentification: req.body['container-identification']
  });
  res.redirect('/gamma/transport/transport-documents-plane');
});

// Route for handling train transport
router.post('/gamma/transport/transport-train', function (req, res) {
  req.session.data['railway-bill'] = req.body['railway-bill'];
  req.session.data['train-departure'] = req.body['train-departure'];
  req.session.data['freight-bill'] = req.body['freight-bill'];

  req.session.data['transportTypes'] = req.session.data['transportTypes'] || [];
  req.session.data['transportTypes'].push({
    type: 'Train',
    railwayBill: req.body['railway-bill'],
    trainDeparture: req.body['train-departure'],
    freightBillNumber: req.body['freight-bill']
  });
  res.redirect('/gamma/transport/transport-documents-train');
});

// Route for handling container vessel transport
router.post('/gamma/transport/transport-container-vessel', function (req, res) {
  req.session.data['vessel-name'] = req.body['vessel-name'];
  req.session.data['flag-state'] = req.body['flag-state'];
  req.session.data['container-vessel-departure'] = req.body['container-vessel-departure'];
  req.session.data['freight-bill'] = req.body['freight-bill'];

  req.session.data['transportTypes'] = req.session.data['transportTypes'] || [];
  req.session.data['transportTypes'].push({
    type: 'Container vessel',
    vesselName: req.body['vessel-name'],
    flagState: req.body['flag-state'],
    containerVesselDeparture: req.body['container-vessel-departure'],
    freightBillNumber: req.body['freight-bill']
  });
  res.redirect('/gamma/transport/transport-documents-vessel');
});


// TRUCK DOCUMENTS
router.post('/gamma/transport/transport-documents', function (req, res) {
  let documentNames = req.session.data['documentName[]'] || [];
  let referenceNumbers = req.session.data['referenceNumber[]'] || [];

  const names = req.body['documentName[]'] || req.body.documentName;
  const refs = req.body['referenceNumber[]'] || req.body.referenceNumber;
  const editIndex = req.body.editIndex;

  if (editIndex !== undefined && editIndex !== '') {
    documentNames[editIndex] = names;
    referenceNumbers[editIndex] = refs;
  } else {
    if (Array.isArray(names)) {
      documentNames.push(...names);
      referenceNumbers.push(...refs);
    } else {
      documentNames.push(names);
      referenceNumbers.push(refs);
    }
  }

  req.session.data['documentName[]'] = documentNames;
  req.session.data['referenceNumber[]'] = referenceNumbers;

  res.redirect('/gamma/transport/transport-additional');
});

// TRAIN DOCUMENTS
router.post('/gamma/transport/transport-documents-train', function (req, res) {
  let documentNames = req.session.data['trainDocumentName[]'] || [];
  let referenceNumbers = req.session.data['trainReferenceNumber[]'] || [];

  const names = req.body['documentName[]'] || req.body.documentName;
  const refs = req.body['referenceNumber[]'] || req.body.referenceNumber;
  const editIndex = req.body.editIndex;

  if (editIndex !== undefined && editIndex !== '') {
    documentNames[editIndex] = names;
    referenceNumbers[editIndex] = refs;
  } else {
    if (Array.isArray(names)) {
      documentNames.push(...names);
      referenceNumbers.push(...refs);
    } else {
      documentNames.push(names);
      referenceNumbers.push(refs);
    }
  }

  req.session.data['trainDocumentName[]'] = documentNames;
  req.session.data['trainReferenceNumber[]'] = referenceNumbers;

  res.redirect('/gamma/transport/transport-additional');
});

// PLANE DOCUMENTS
router.post('/gamma/transport/transport-documents-plane', function (req, res) {
  let documentNames = req.session.data['planeDocumentName[]'] || [];
  let referenceNumbers = req.session.data['planeReferenceNumber[]'] || [];

  const names = req.body['documentName[]'] || req.body.documentName;
  const refs = req.body['referenceNumber[]'] || req.body.referenceNumber;
  const editIndex = req.body.editIndex;

  if (editIndex !== undefined && editIndex !== '') {
    documentNames[editIndex] = names;
    referenceNumbers[editIndex] = refs;
  } else {
    if (Array.isArray(names)) {
      documentNames.push(...names);
      referenceNumbers.push(...refs);
    } else {
      documentNames.push(names);
      referenceNumbers.push(refs);
    }
  }

  req.session.data['planeDocumentName[]'] = documentNames;
  req.session.data['planeReferenceNumber[]'] = referenceNumbers;

  res.redirect('/gamma/transport/transport-additional');
});

// VESSEL DOCUMENTS
router.post('/gamma/transport/transport-documents-vessel', function (req, res) {
  let documentNames = req.session.data['vesselDocumentName[]'] || [];
  let referenceNumbers = req.session.data['vesselReferenceNumber[]'] || [];

  const names = req.body['documentName[]'] || req.body.documentName;
  const refs = req.body['referenceNumber[]'] || req.body.referenceNumber;
  const editIndex = req.body.editIndex;

  if (editIndex !== undefined && editIndex !== '') {
    documentNames[editIndex] = names;
    referenceNumbers[editIndex] = refs;
  } else {
    if (Array.isArray(names)) {
      documentNames.push(...names);
      referenceNumbers.push(...refs);
    } else {
      documentNames.push(names);
      referenceNumbers.push(refs);
    }
  }

  req.session.data['vesselDocumentName[]'] = documentNames;
  req.session.data['vesselReferenceNumber[]'] = referenceNumbers;

  res.redirect('/gamma/transport/transport-additional');
});





router.post('/gamma/transport/transport-additional', function (req, res) {
  // Handle removal of a transport row
  const removeIndex = req.body.removeIndex;
  if (removeIndex !== undefined && removeIndex !== '') {
    let transportTypes = req.session.data['transportTypes'] || [];
    // Get the type of the transport being removed
    const removed = transportTypes[removeIndex];
    const removedType = removed && removed.type;
    transportTypes.splice(removeIndex, 1);
    req.session.data['transportTypes'] = transportTypes;
    // Only remove from the relevant document/reference arrays for the removed type
    if (removedType === 'Truck') {
      let documentNames = req.session.data['documentName[]'] || [];
      let referenceNumbers = req.session.data['referenceNumber[]'] || [];
      if (documentNames.length > removeIndex) documentNames.splice(removeIndex, 1);
      if (referenceNumbers.length > removeIndex) referenceNumbers.splice(removeIndex, 1);
      req.session.data['documentName[]'] = documentNames;
      req.session.data['referenceNumber[]'] = referenceNumbers;
    } else if (removedType === 'Train') {
      let trainDocumentNames = req.session.data['trainDocumentName[]'] || [];
      let trainReferenceNumbers = req.session.data['trainReferenceNumber[]'] || [];
      if (trainDocumentNames.length > removeIndex) trainDocumentNames.splice(removeIndex, 1);
      if (trainReferenceNumbers.length > removeIndex) trainReferenceNumbers.splice(removeIndex, 1);
      req.session.data['trainDocumentName[]'] = trainDocumentNames;
      req.session.data['trainReferenceNumber[]'] = trainReferenceNumbers;
    } else if (removedType === 'Plane') {
      let planeDocumentNames = req.session.data['planeDocumentName[]'] || [];
      let planeReferenceNumbers = req.session.data['planeReferenceNumber[]'] || [];
      if (planeDocumentNames.length > removeIndex) planeDocumentNames.splice(removeIndex, 1);
      if (planeReferenceNumbers.length > removeIndex) planeReferenceNumbers.splice(removeIndex, 1);
      req.session.data['planeDocumentName[]'] = planeDocumentNames;
      req.session.data['planeReferenceNumber[]'] = planeReferenceNumbers;
    } else if (removedType === 'Container vessel') {
      let vesselDocumentNames = req.session.data['vesselDocumentName[]'] || [];
      let vesselReferenceNumbers = req.session.data['vesselReferenceNumber[]'] || [];
      if (vesselDocumentNames.length > removeIndex) vesselDocumentNames.splice(removeIndex, 1);
      if (vesselReferenceNumbers.length > removeIndex) vesselReferenceNumbers.splice(removeIndex, 1);
      req.session.data['vesselDocumentName[]'] = vesselDocumentNames;
      req.session.data['vesselReferenceNumber[]'] = vesselReferenceNumbers;
    }
    return res.redirect('/gamma/transport/transport-additional');
  }
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
  req.session.data['airway-bill'] = req.body['airway-bill'];
  req.session.data['flight-number'] = req.body['flight-number'];
  req.session.data['plane-departure'] = req.body['plane-departure'];
  req.session.data['container-identification'] = req.body['container-identification']; // single value
  req.session.data['freight-bill'] = req.body['freight-bill'];
  res.redirect('../gamma/progress');
});

router.post('../gamma/transport/transport-documents-plane', function (req, res) {
  req.session.data['airway-bill'] = req.body['airway-bill'];
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

// Add your routes here
// Route for displaying the 'Check your answers' page
router.get('/poc/transport/check-your-answers', function (req, res) {
  const data = req.session.data;
  const groupedTransportTypes = getGroupedTransportTypes(data);
  res.render('poc/transport/check-your-answers', {
    data,
    groupedTransportTypes
  });
});


// Route for handling transport selection
router.post('/poc/transport/transport-type', function (req, res) {
    const transportType = req.body['transport-type'];
  
    if (transportType === 'Truck') {
      res.redirect('/poc/transport/transport-truck');
    } else if (transportType === 'Plane') {
      res.redirect('/poc/transport/transport-plane');
    } else if (transportType === 'Train') {
      res.redirect('/poc/transport/transport-train');
    } else if (transportType === 'Container vessel') {
      res.redirect('/poc/transport/transport-container-vessel');
    } else {
      res.redirect('/poc/transport/transport-type');  // Redirect back if no option selected

  }
});


// Route for handling truck transport
router.post('/poc/transport/transport-truck', function (req, res) {
  req.session.data['truck-nationality'] = req.body['truck-nationality'];
  req.session.data['truck-registration'] = req.body['registration-number'];
  req.session.data['export-place'] = req.body['export-place'];
  req.session.data['freight-number'] = req.body['freight-number'];

  // Add to transportTypes array in session
  req.session.data['transportTypes'] = req.session.data['transportTypes'] || [];
  req.session.data['transportTypes'].push({
    type: 'Truck',
    truckNationality: req.body['truck-nationality'],
    truckRegistration: req.body['registration-number'],
    exportPlace: req.body['export-place'],
    freightBillNumber: req.body['freight-number']
  });
  res.redirect('/poc/transport/transport-documents');
});

// Route for handling plane transport
router.post('/poc/transport/transport-plane', function (req, res) {
  req.session.data['airway-bill'] = req.body['airway-bill'];
  req.session.data['flight-number'] = req.body['flight-number'];
  req.session.data['plane-departure'] = req.body['plane-departure'];
  req.session.data['container-identification'] = req.body['container-identification'];

  req.session.data['transportTypes'] = req.session.data['transportTypes'] || [];
  req.session.data['transportTypes'].push({
    type: 'Plane',
    flightNumber: req.body['flight-number'],
    planeDeparture: req.body['plane-departure'],
    airwayBill: req.body['airway-bill'],
    containerIdentification: req.body['container-identification']
  });
  res.redirect('/poc/transport/transport-documents-plane');
});

// Route for handling train transport
router.post('/poc/transport/transport-train', function (req, res) {
  req.session.data['railway-bill'] = req.body['railway-bill'];
  req.session.data['train-departure'] = req.body['train-departure'];
  req.session.data['freight-bill'] = req.body['freight-bill'];

  req.session.data['transportTypes'] = req.session.data['transportTypes'] || [];
  req.session.data['transportTypes'].push({
    type: 'Train',
    railwayBill: req.body['railway-bill'],
    trainDeparture: req.body['train-departure'],
    freightBillNumber: req.body['freight-bill']
  });
  res.redirect('/poc/transport/transport-documents-train');
});

// Route for handling container vessel transport
router.post('/poc/transport/transport-container-vessel', function (req, res) {
  req.session.data['vessel-name'] = req.body['vessel-name'];
  req.session.data['flag-state'] = req.body['flag-state'];
  req.session.data['container-vessel-departure'] = req.body['container-vessel-departure'];
  req.session.data['freight-bill'] = req.body['freight-bill'];

  req.session.data['transportTypes'] = req.session.data['transportTypes'] || [];
  req.session.data['transportTypes'].push({
    type: 'Container vessel',
    vesselName: req.body['vessel-name'],
    flagState: req.body['flag-state'],
    containerVesselDeparture: req.body['container-vessel-departure'],
    freightBillNumber: req.body['freight-bill']
  });
  res.redirect('/poc/transport/transport-documents-vessel');
});


router.get('/poc/transport/transport-documents', function (req, res) {
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
    return res.redirect('/poc/transport/transport-additional');
  }

  // Handle editing
  if (editIndex !== undefined) {
    res.render('poc/transport/transport-documents', {
      data: req.session.data,
      editIndex: editIndex,
      editDocumentName: documentNames[editIndex],
      editReferenceNumber: referenceNumbers[editIndex]
    });
  } else {
    res.render('poc/transport/transport-documents', {
      data: req.session.data
    });
  }
});



router.post('/poc/transport/transport-additional', function (req, res) {
  // Handle removal of a transport row
  const removeIndex = req.body.removeIndex;
  if (removeIndex !== undefined && removeIndex !== '') {
    let transportTypes = req.session.data['transportTypes'] || [];
    // Get the type of the transport being removed
    const removed = transportTypes[removeIndex];
    const removedType = removed && removed.type;
    transportTypes.splice(removeIndex, 1);
    req.session.data['transportTypes'] = transportTypes;
    // Only remove from the relevant document/reference arrays for the removed type
    if (removedType === 'Truck') {
      let documentNames = req.session.data['documentName[]'] || [];
      let referenceNumbers = req.session.data['referenceNumber[]'] || [];
      if (documentNames.length > removeIndex) documentNames.splice(removeIndex, 1);
      if (referenceNumbers.length > removeIndex) referenceNumbers.splice(removeIndex, 1);
      req.session.data['documentName[]'] = documentNames;
      req.session.data['referenceNumber[]'] = referenceNumbers;
    } else if (removedType === 'Train') {
      let trainDocumentNames = req.session.data['trainDocumentName[]'] || [];
      let trainReferenceNumbers = req.session.data['trainReferenceNumber[]'] || [];
      if (trainDocumentNames.length > removeIndex) trainDocumentNames.splice(removeIndex, 1);
      if (trainReferenceNumbers.length > removeIndex) trainReferenceNumbers.splice(removeIndex, 1);
      req.session.data['trainDocumentName[]'] = trainDocumentNames;
      req.session.data['trainReferenceNumber[]'] = trainReferenceNumbers;
    } else if (removedType === 'Plane') {
      let planeDocumentNames = req.session.data['planeDocumentName[]'] || [];
      let planeReferenceNumbers = req.session.data['planeReferenceNumber[]'] || [];
      if (planeDocumentNames.length > removeIndex) planeDocumentNames.splice(removeIndex, 1);
      if (planeReferenceNumbers.length > removeIndex) planeReferenceNumbers.splice(removeIndex, 1);
      req.session.data['planeDocumentName[]'] = planeDocumentNames;
      req.session.data['planeReferenceNumber[]'] = planeReferenceNumbers;
    } else if (removedType === 'Container vessel') {
      let vesselDocumentNames = req.session.data['vesselDocumentName[]'] || [];
      let vesselReferenceNumbers = req.session.data['vesselReferenceNumber[]'] || [];
      if (vesselDocumentNames.length > removeIndex) vesselDocumentNames.splice(removeIndex, 1);
      if (vesselReferenceNumbers.length > removeIndex) vesselReferenceNumbers.splice(removeIndex, 1);
      req.session.data['vesselDocumentName[]'] = vesselDocumentNames;
      req.session.data['vesselReferenceNumber[]'] = vesselReferenceNumbers;
    }
    return res.redirect('/poc/transport/transport-additional');
  }
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
    res.redirect('/poc/transport/transport-type');
  } else if (additionalModes === 'No') {
    res.redirect('/poc/progress-complete');
  } else {
    res.redirect('/poc/transport/transport-additional');
  }
});




// Route for exporter details
router.post('../poc/add-products', function (req, res) {
  req.session.data['exporter-name'] = req.body['exporter-name']
  req.session.data['company-name'] = req.body['exporter-name']
  // Add more fields as needed
  res.redirect('../poc/add-products')
})



// Route for landing details
router.post('../poc/add-landings', function (req, res) {
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
  res.redirect('../poc/catch-waters');
});


  // Route for export journey


 router.post('../poc/catch-waters', function (req, res) {
  req.session.data['waters'] = req.body['waters']; // This will be an array if multiple checkboxes are selected
  res.redirect('../poc/export-journey');
});

router.post('../poc/progress', function (req, res) {
  req.session.data['waters'] = req.body['waters'];
  res.redirect('../poc/progress');
});

router.post('../poc/export-journey', function (req, res) {
  req.session.data['waters'] = req.body['waters'];
  res.redirect('../poc/export-journey');
});

  // Route for plane transport

router.post('../poc/progress', function (req, res) {
  req.session.data['departure-country'] = req.body['departure-country'];
  req.session.data['destination-country'] = req.body['destination-country'];
  res.redirect('../poc/progress');
});

router.post('../poc/transport/transport-type', function (req, res) {
  req.session.data['departure-country'] = req.body['departure-country'];
  req.session.data['destination-country'] = req.body['destination-country'];
  res.redirect('../poc/transport/transport-type');
});

router.post('../poc/progress', function (req, res) {
  req.session.data['airway-bill'] = req.body['airway-bill'];
  req.session.data['flight-number'] = req.body['flight-number'];
  req.session.data['plane-departure'] = req.body['plane-departure'];
  req.session.data['container-identification'] = req.body['container-identification']; // single value
  req.session.data['freight-bill'] = req.body['freight-bill'];
  res.redirect('../poc/progress');
});

router.post('../poc/transport/transport-documents-plane', function (req, res) {
  req.session.data['airway-bill'] = req.body['airway-bill'];
  req.session.data['flight-number'] = req.body['flight-number'];
  req.session.data['plane-departure'] = req.body['plane-departure'];
  req.session.data['container-identification'] = req.body['container-identification']; // single value
  req.session.data['freight-bill'] = req.body['freight-bill'];
  res.redirect('../poc/transport/transport-documents-plane');
});

router.post('../poc/transport/check-your-answers', function (req, res) {
  // You could log, save, or simulate submission here
  console.log('Final submission:', req.session.data);

  // Redirect to a confirmation page
  res.redirect('../poc/catch-certificate-complete');
});

router.get('../poc/catch-certificate-complete', function (req, res) {
  res.render('../poc/catch-certificate-complete');
});

// Helper function to group transport types and attach document arrays
function getGroupedTransportTypes(data) {
  const grouped = {};
  const types = data['transportTypes'] || [];
  types.forEach((t, idx) => {
    // Only attach document arrays to the first entry of each type
    const isFirstOfType = idx === types.findIndex(e => e.type === t.type);
    const entry = { ...t, _originalIndex: idx };
    if (isFirstOfType) {
      if (t.type === 'Truck') {
        entry.documentName = data['documentName[]'] || [];
        entry.referenceNumber = data['referenceNumber[]'] || [];
      } else if (t.type === 'Train') {
        entry.documentName = data['trainDocumentName[]'] || [];
        entry.referenceNumber = data['trainReferenceNumber[]'] || [];
      } else if (t.type === 'Plane') {
        entry.documentName = data['planeDocumentName[]'] || [];
        entry.referenceNumber = data['planeReferenceNumber[]'] || [];
      } else if (t.type === 'Container vessel') {
        entry.documentName = data['vesselDocumentName[]'] || [];
        entry.referenceNumber = data['vesselReferenceNumber[]'] || [];
      }
    } else {
      entry.documentName = [];
      entry.referenceNumber = [];
    }
    if (!grouped[t.type]) grouped[t.type] = [];
    grouped[t.type].push(entry);
  });
  // Remove duplicate document/reference display: only keep docs/refs on first entry of each type
  Object.keys(grouped).forEach(type => {
    grouped[type].forEach((entry, i) => {
      if (i > 0) {
        entry.documentName = [];
        entry.referenceNumber = [];
      }
    });
  });
  return grouped;
}

// Update GET for check-your-answers
router.get('/gamma/transport/check-your-answers', function (req, res) {
  const data = req.session.data;
  const groupedTransportTypes = getGroupedTransportTypes(data);
  res.render('gamma/transport/check-your-answers', {
    data,
    groupedTransportTypes
  });
});

// Update GET for transport-additional
router.get('/gamma/transport/transport-additional', function (req, res) {
  const data = req.session.data;
  const groupedTransportTypes = getGroupedTransportTypes(data);
  res.render('gamma/transport/transport-additional', {
    data,
    groupedTransportTypes
  });
});
