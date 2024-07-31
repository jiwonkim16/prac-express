const deleteDeviceByUID = (req, res, next)=>{
    if(req.method === 'DELETE' && req.query.uid){
        const uid = req.query.uid

        const device = req.app.db.get('device').find({uid}).value()

        if(device){
            // 삭제할 데이터
            req.app.db.get('device').remove({ uid }).write();
            res.status(200).json({message : "Device delete successfully"})
        }else{
            return res.status(400).json({error : "Dvice not founddddddddd"})
        }
    } else {
        next()
    }
}

module.exports = {deleteDeviceByUID}