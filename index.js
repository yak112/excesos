/* Calculadora de excesos según el ADPC en vigor.
    Copyright (C) 2021  H. Garabito 
	Web publicada bajo la licencia GPLv3. https://www.gnu.org/licenses/ */
const https = require('https')
const fs = require('fs')
const express = require('express')
const app = express()
const formidable = require('formidable');
const cors = require('cors')
const pdfFiller   = require('pdffiller');
const rnd_str = require('@supercharge/strings')
const path = require('path')
const { round, floor, add } = require('mathjs')

const httpsOptions = {
    key: fs.readFileSync('./conf/AvisosRodalies.key'),
    cert: fs.readFileSync('./conf/AvisosRodalies.pem')
}
const sourcePDF = "./web/files/plantilla.pdf";

app.use(cors())
app.options('*', cors())

app.use(express.static('web'))
app.get('/', function (req, res) {
  res.sendFile('index.html')
})
app.post('/pdf', function(req, res,next) {
	const form = formidable({ multiples: true });
	var filename = rnd_str.random();
	const destinationPDF = path.join(__dirname,'/web/tmp/',filename);
	form.parse(req, (err, fields, files) => {
		if(err){ console.log(err);}
		else {
			var data_text = "";
			//Sumamos minutos y generamos los textos para el PDF
			var min_totales = add(fields.horasMD,fields.horasMerma,fields.horasExtra);
			if(fields.horasMD > '0')  data_text = "Minutos de mayor dedicación: "+fields.horasMD;
			if(fields.horasMerma > '0')  data_text = data_text+"\nMinutos de merma de descanso: "+fields.horasMerma;
			if(fields.horasExtra > '0')  data_text = data_text+"\nMinutos de horas extra: "+fields.horasExtra;
			if(min_totales >= 60) {
				data_text = data_text+"\nEn total corresponden "+min_totales+" minutos de compensación, o "+floor(min_totales/60)+" horas y "+round(min_totales%60)+" minutos de compensación.";
			} else {
				data_text = data_text+"\nEn total corresponden "+min_totales+" minutos de compensación";
			}
			var data = {
			    "NotasInt": data_text,
			    "NotasIntLbl": data_text
			};
			pdfFiller.fillFormWithFlatten(sourcePDF,destinationPDF,data,false,function(err) {
				if(err){
					console.log(err)
					res.send({status: "pdf_error"})
				}else{
					console.log("PDF relleno en "+destinationPDF)
					res.send({status: "ok", file: filename})
				}
			})
		}
	})
})
app.get("/download/:fileID", function (req, res) {
	var filepath = path.join(__dirname,'/web/tmp/',req.params.fileID);
	console.log("Descargando PDF "+filepath)
	res.type('application/pdf')
	res.download(filepath,"excesos_generados.pdf",function (err) {
		if(err){
			console.log(err)
			res.send({status: "download_error"})
		}else {
			res.status(200).end()
		}
	})
})
https.createServer(httpsOptions, app).listen(4433,function(err) {
	if(err) console.log(err);
	console.log("Listening on port 4433")
})