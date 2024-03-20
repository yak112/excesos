/* Calculadora de excesos según el ADPC en vigor.
    Copyright (C) 2024  H. Garabito 
	Web publicada bajo la licencia GPLv3. https://www.gnu.org/licenses/ */
import express from 'express';
import formidable from 'formidable';
import cors from 'cors';
import fillForm from "@sparticuz/pdffiller";
import { Str } from '@supercharge/strings'
import {join} from 'path';
import { round, floor, add } from 'mathjs';
import { createLogger, format as _format, transports as _transports } from 'winston';

const sourcePDF = "./web/files/plantilla.pdf";

const app = express()
app.set('trust proxy', function (ip) {
  if (ip === '127.0.0.1' || ip === '192.168.0.51') return true; // trusted IPs
  else return false;
});

app.use(cors())
app.options('*', cors())

const logger = createLogger({
	level: 'info',
	format: _format.json(),
	defaultMeta: { service: 'user-service' },
	transports: [
	  //
	  // - Write all logs with importance level of `error` or less to `error.log`
	  // - Write all logs with importance level of `info` or less to `combined.log`
	  //
	  new _transports.File({ filename: 'log/error.log', level: 'error' }),
	  new _transports.File({ filename: 'log/combined.log' }),
	],
  });

app.use(express.static('web'))
app.get('/', function (req, res) {
  res.sendFile('index.html')
})
app.post('/pdf', function(req, res) {
	const form = formidable({ multiples: true });
	var filename = Str.random();
	const destinationPDF = join('./web/tmp/',filename);
	form.parse(req, (err, fields) => {
		if(err){ 
			console.log(err) 
			logger.error(err)
		}
		else {
			var data_text = "";
			//Sumamos minutos y generamos los textos para el PDF
			var min_totales = add(fields.horasMD,fields.horasMerma,fields.horasExtra);
			if(fields.horasMD > '0')  data_text = "Minutos de mayor dedicacion: "+fields.horasMD;
			if(fields.horasMerma > '0')  data_text = data_text+"\nMinutos de merma de descanso: "+fields.horasMerma;
			if(fields.horasExtra > '0')  data_text = data_text+"\nMinutos de horas extra: "+fields.horasExtra;
			if(min_totales >= 60) {
				data_text = data_text+"\nEn total corresponden "+min_totales+" minutos de compensacion, o "+floor(min_totales/60)+" horas y "+round(min_totales%60)+" minutos de compensacion.";
			} else {
				data_text = data_text+"\nEn total corresponden "+min_totales+" minutos de compensacion";
			}
			var data = {
			    "NotasInt": data_text,
			    "NotasIntLbl": data_text
			};
			fillForm(sourcePDF,data)
				.toFile(destinationPDF)
				.then(() => {
					console.log("PDF relleno en "+destinationPDF)
					logger.info("PDF relleno en "+destinationPDF)
					res.send({status: "ok", file: filename})
				})
				.catch((err) => {
					console.log(err)
					logger.error(err)
					res.send({status: "pdf_error"})
				})
			
		}
	})
})
app.get("/download/:fileID", function (req, res) {
	var filepath = join('./web/tmp/',req.params.fileID);
	console.log("Descargando PDF "+filepath)
	res.type('application/pdf')
	res.download(filepath,"excesos_generados.pdf",function (err) {
		if(err){
			console.log(err)
			logger.error(err)
			res.send({status: "download_error"})
		}else {
			res.status(200).end()
		}
	})
})
app.listen(4433,function(err) {
	if(err) {
		console.log(err)
		logger.error(err)
	} 
	logger.info("Serevidor escuchando en puerto 4433")
	console.log("Listening on port 4433")
})
