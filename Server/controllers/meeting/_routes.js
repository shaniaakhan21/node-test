const express = require('express');

const router = express.Router();
const meeting = require('./meeting'); 

router.post('/add', meeting.add);
router.get('/', meeting.index);
router.get('/view/:id', meeting.view);
router.delete('/delete/:id', meeting.deleteData);
router.post('/deleteMany', meeting.deleteMany);


module.exports = router