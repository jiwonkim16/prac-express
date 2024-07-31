const updateDeviceByUID = (req, res, next) => {
    if (req.method === 'PUT' && req.query.uid) {
        const uid = req.query.uid;
        const updatedData = req.body;

        // 'device' 컬렉션에서 uid에 해당하는 항목 찾기
        const device = req.app.db.get('device').find({ uid }).value();

        if (device) {
            // 업데이트할 데이터를 병합
            req.app.db.get('device')
                .find({ uid })
                .assign(updatedData)
                .write();
            res.status(200).json({ message: 'Device updated successfully' });
        } else {
            return res.status(404).json({ error: "Device not found" });
        }
    } else {
        next();
    }
};

module.exports = { updateDeviceByUID };
