const functions = require('firebase-functions');
const admin=require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var newChat;
const nodemailer = require('nodemailer');
admin.initializeApp(functions.config().firebase);


//admin.initializeApp();
require('dotenv').config()

const {SENDER_EMAIL, SENDER_PASS}= process.env;

exports.sendProviderRecoveryEmail=functions.firestore.document('provider_recovery_email/{docID}').onCreate((snap,context)=>{	
	const data=snap.data();
	let authData = nodemailer.createTransport({
		host:'smtp.gmail.com',
		port:587,
		secure: false,
		auth: {
		  user: SENDER_EMAIL, 
		  pass: SENDER_PASS
		}
		
		
});

	authData.sendMail({
		from: 'imatternotification@gmail.com',
		to: data.email, // list of receivers
		subject: "Imatter InfoDesk", // Subject line
		text: "Here is your recovery code: " + data.code, // plain text body
		html: "Here is your recovery code: " + data.code // html body
		//res.send("sent");
		}).then(res=>console.log('successfully sent that mail')).catch(err=>console.log(err));
	});