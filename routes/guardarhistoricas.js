//const db = admin.firestore()
const adminfirestore = require('../firebase/firestore')
const dbfirestore = adminfirestore.firestore()
const moment = require('moment')
var cron = require('node-cron');
const pgdb = require('../pg/conpgtaberna')
const pgp = require('pg-promise')({
    /*initialization options */
    capSQL: true // capitalize all generated SQL
});
const { Router } = require('express')
const router = Router()
///FALTA PROTGER RUTAS CON HEADERS DESDE FIREBASE AUTH
router.post('/cobrar', async (req, res) => {
    let datoscomanda = req.body
    datoscomanda.nfactura = ''
    datoscomanda.fechahora = new Date(datoscomanda.fechahora.seconds * 1000)
    delete datoscomanda.email
    const query = pgp.helpers.insert(datoscomanda, null, 'comandashist') + ' returning *';
    console.log(query);

    try {
        const datoscomandaspg = await pgdb.one(query);
        res.send(datoscomandaspg)

    } catch (error) {
        console.log(error);

    }
})
router.post('/insertardetalles', async (req, res) => {
    let detallescomanda = req.body
    //datoscomanda.nfactura=''
    detallescomanda.horacomanda = new Date(detallescomanda.horacomanda.seconds * 1000)
    detallescomanda.horapedido = new Date(detallescomanda.horapedido.seconds * 1000)
    //console.log(detallescomanda)
    const query = pgp.helpers.insert(detallescomanda, null, 'detallescomandahist') + ' returning *';
    console.log(query);

    try {
        const detallescomandaspg = await pgdb.one(query);
        res.send(detallescomandaspg)

    } catch (error) {
        console.log(error);

    }
})
router.post('/addcaja', async (req, res) => {

    let datoscaja = req.body
    console.log(datoscaja);

    const query = pgp.helpers.insert(datoscaja, null, 'caja') + ' returning *';
    //console.log(query);

    try {
        const datoscomandaspg = await pgdb.one(query);
        res.send(datoscomandaspg)

    } catch (error) {
        console.log(error);

    }
})

router.post('/addflujoscaja', async (req, res) => {
    let datosflujo = req.body
    datosflujo.forEach(el => {
        el.fechahora = new Date(el.fechahora.seconds * 1000)
    })
    if (datosflujo.length == 0) { res.send(datosflujo); return }
    console.log(datosflujo);
    let gg = []
    const cs = new pgp.helpers.ColumnSet([
        'cantidad', 'fecha',
        'fechahora',
        'flujo',
        'hora',
        'id',
        'idcaja',
        'retiradopor',

    ], { table: 'flujoscaja' });

    const values = datosflujo;
    const query = pgp.helpers.insert(values, cs) + 'returning *';
    try {

        const flujoinsertedpg = await pgdb.many(query);

        //console.log(datoscaja);
        res.send(flujoinsertedpg)
    } catch (e) {
        console.log(e);
    }
})


router.post('/updatescanner', async (req, res) => {
    let idcomandas = req.body
    arra = []
    idcomandas.forEach(el => {
        arra.push({ idcomanda: el, facturado: false, scanner: true })
    })

    const dataMulti = arra
    const cs = new pgp.helpers.ColumnSet(['?idcomanda',
        'facturado', 'scanner'], { table: 'comandashist' });

    const query = pgp.helpers.update(dataMulti, cs) + ' WHERE v.idcomanda = t.idcomanda returning v.idcomanda';
    console.log(query);
    try {
        const update = await pgdb.many(query);
        console.log(update);
        res.send(update)

    } catch (error) {
        console.log(error);
    }


})
router.post('/checkpgscanner', async (req, res) => {
    let idcomandas = req.body
    arra = []
    idcomandas.forEach(el => {
        arra.push({ idcomanda: el })
    })

    const dataMulti = arra

    let resArrSI = []
    let resArrNO = []
    try {
        const sele = await pgdb.many('select idcomanda,facturado,visa,fechahora,scanner,mesa,total from comandashist where idcomanda in($1:csv) ', [idcomandas]);

        sele.forEach(el => {
            if (el.facturado == true && el.visa == false) resArrSI.push(el)
            else resArrNO.push(el)
        })
        res.send({ resSI: resArrSI, resNO: resArrNO })

    } catch (error) {
        //console.log(error);
        res.send({ resSI: resArrSI, resNO: resArrNO })
    }


})
router.get('/getscanner', async (req, res) => {
    try {
        const sele = await pgdb.any('select * from comandashist where scanner=true ');
        res.send(sele)
    } catch (error) {
        let sele = []
        console.log(err);
        res.send(sele)
    }

})
router.get('/getcajas', async (req, res) => {
    try {
        const sele = await pgdb.any('select * from caja');
        res.send(sele)
    } catch (error) {
        let sele = []
        console.log(err);
        res.send(sele)
    }

})
router.get('/correlativos', async (req, res) => {
    dbfirestore
    const correlativosCol = dbfirestore.collection('correlativos')
    const correlativosData = await correlativosCol.get()
    let correlativosFb = []
    correlativosData.forEach(el => {
        correlativosFb.push(el)
    })
    //res.send(correlativosFb)
    if (correlativosFb.length == 0) {
        /* const cajaCol = dbfirestore.collection('caja')
        const cajaData = await cajaCol.get()
        let cajaFb = []
        cajaData.forEach(el => {
            cajaFb.push(el.id)
        }) */
        cajahoy =  'S7V9a0laUtvRrFt6NkkY'// "B9IfkhhOCqqIsOuRQCoN"
        //res.send(cajaFb)

        try {
            const max = await pgdb.any('select max(idcomhistpg) from comandashist where idcaja=$1',[cajahoy]);
            const min = await pgdb.any('select min(idcomhistpg) from comandashist where idcaja=$1',[cajahoy]);
            res.send({min:min[0].min,max:max[0].max})
        } catch (error) {
            let sele = []
            console.log(err);
            res.send(sele)
        }

    }
})




module.exports = router