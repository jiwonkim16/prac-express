// middleware/addDevice.js
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const newDevices = req.body; // 배열이나 객체를 받을 수 있음

    if (Array.isArray(newDevices)) {
        newDevices.forEach(device => {
            req.app.db.get('device').push(device).write();
        });
    } else {
        req.app.db.get('device').push(newDevices).write();
    }

    res.status(201).json({ message: "Devices added successfully" });
});

module.exports = router;
