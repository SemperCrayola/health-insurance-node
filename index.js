

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const cors = require("cors")

var url = require('url');
var dt = require('./date-time');

const port = process.env.PORT || 3000
const majorVersion = 1
const minorVersion = 3

// Use Express to publish static HTML, CSS, and JavaScript files that run in the browser. 
app.use(express.static(__dirname + '/static'))
app.use(cors({ origin: '*' }))

// The app.get functions below are being processed in Node.js running on the server.
// Implement a custom About page.
app.get('/about', (request, response) => {
	console.log('Calling "/about" on the Node.js server.')
	response.type('text/plain')
	response.send('About Node.js on Azure Template.')
})

app.get('/version', (request, response) => {
	console.log('Calling "/version" on the Node.js server.')
	response.type('text/plain')
	response.send('Version: '+majorVersion+'.'+minorVersion)
})

app.get('/api/ping', (request, response) => {
	console.log('Calling "/api/ping"')
	response.type('text/plain')
	response.send('ping response')
})

// Return the value of 2 plus 2.
app.get('/2plus2', (request, response) => {
	console.log('Calling "/2plus2" on the Node.js server.')
	response.type('text/plain')
	response.send('4')
})

// Add x and y which are both passed in on the URL. 
app.get('/add-two-integers', (request, response) => {
	console.log('Calling "/add-two-integers" on the Node.js server.')
	var inputs = url.parse(request.url, true).query
	let x = parseInt(inputs.x)
	let y = parseInt(inputs.y)
	let sum = x + y
	response.type('text/plain')
	response.send(sum.toString())
})



// Test a variety of functions.
app.get('/test', (request, response) => {
    // Write the request to the log. 
    console.log(request);

    // Return HTML.
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('<h3>Testing Function</h3>')

    // Access function from a separate JavaScript module.
    response.write("The date and time are currently: " + dt.myDateTime() + "<br><br>");

    // Show the full url from the request. 
    response.write("req.url="+request.url+"<br><br>");

    // Suggest adding something tl the url so that we can parse it. 
    response.write("Consider adding '/test?year=2017&month=July' to the URL.<br><br>");
    
	// Parse the query string for values that are being passed on the URL.
	var q = url.parse(request.url, true).query;
    var txt = q.year + " " + q.month;
    response.write("txt="+txt);

    // Close the response
    response.end('<h3>The End.</h3>');
})

// Return Batman as JSON.
const batMan = {
	"firstName":"Bruce",
	"lastName":"Wayne",
	"preferredName":"Batman",
	"email":"darkknight@lewisu.edu",
	"phoneNumber":"800-bat-mann",
	"city":"Gotham",
	"state":"NJ",
	"zip":"07101",
	"lat":"40.73",
	"lng":"-74.17",
	"favoriteHobby":"Flying",
	"class":"cpsc-24700-001",
	"room":"AS-104-A",
	"startTime":"2 PM CT",
	"seatNumber":"",
	"inPerson":[
		"Monday",
		"Wednesday"
	],
	"virtual":[
		"Friday"
	]
}

app.get('/batman', (request, response) => {
	console.log('Calling "/batman" on the Node.js server.')
	response.type('application/json')
	response.send(JSON.stringify(batMan))
})

// Load your JSON data
const favoritePlaces = require('./FavoritePlaces.json');

// Create a route that serves the JSON data
app.get('/api/favorite-places', (req, res) => {
  res.json(favoritePlaces);
});

app.post('/addAge', (req, res) => {

    const age = parseInt(req.body.age);
    let agePoints = 0;
    if(age<30){
        agePoints = 0;
    }else if(age<45){
        agePoints = 10;
    }else if(age<60){
        agePoints = 20;
    }else{
        agePoints = 30;
    }
    res.json({ agePoints });
});
app.post('/addBloodPressure', (req, res) => {

    const systolic = parseInt(req.body.systolic);
    const diastolic = parseInt(req.body.diastolic)
    let bloodPressurePoints = 0;
    var bloodPressureType;
    if (systolic < 120 && diastolic <= 80) {
        bloodPressureType = 'normal';
        bloodPressurePoints = 0;
    } else if (systolic >= 120 && systolic <= 129 && diastolic <= 80) {
        bloodPressureType = 'elevated';
        bloodPressurePoints = 15;
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89))  {
        bloodPressureType = 'stage one';
        bloodPressurePoints = 30;
    } else if(systolic >= 140 || diastolic >= 90){
        bloodPressureType = 'stage two';
        bloodPressurePoints = 75;
    }else if ((systolic > 180 && diastolic > 120) || (systolic > 180 || diastolic > 120)){
        bloodPressureType = 'crisis';
        bloodPressurePoints = 100;
    }
    else{
        bloodPressureType = 'Please enter valid numbers';
        bloodPressurePoints = 'could not compute';
    }
    res.json({bloodPressureType, bloodPressurePoints });
});


app.post('/calculateBMI', (req, res) => {
    const weight = parseInt(req.body.weight);
    const height = parseInt(req.body.height);
    
    const weightKg = weight * 0.453592;
    const heightM = height * 0.0254;

    const bmi = weightKg / (heightM * heightM);

    let bmiPoints = 0;
    if (bmi >= 18.5 && bmi <= 24.9) {
        bmiPoints = 0;
    } else if (bmi >= 25.0 && bmi <= 29.9) {
        bmiPoints = 10;
    } else if (bmi >= 30.0 && bmi <= 34.9) {
        bmiPoints = 20;
    } else {
        bmiPoints = 30;
    }

    res.json({ bmiPoints, bmi });
});

app.post('/calculatePoints', (req, res) => {
	const history = req.body.history;
    	let historyPoints = 0;
    	if (history.includes("diabetes")) {
        	historyPoints += 10;
    	}
    	if (history.includes("cancer")) {
        	historyPoints += 10;
    	}
    	if (history.includes("alzheimers")) {
        	historyPoints += 10;
    	}
    	res.json({ historyPoints });
});

// Add a new function to calculate total points and determine risk category

app.post('/calculateTotalPoints', (req, res) => {
    const { age, systolic, diastolic, weight, height, history } = req.body;

    let totalPoints = 0;

    if (age < 30) {
        totalPoints += 0;
    } else if (age < 45) {
        totalPoints += 10;
    } else if (age < 60) {
        totalPoints += 20;
    } else {
        totalPoints += 30;
    }

    if (systolic < 120 && diastolic < 80) {
        totalPoints += 0;
    } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
        totalPoints += 15;
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
        totalPoints += 30;
    } else if (systolic >= 140 || diastolic >= 90) {
        totalPoints += 75;
    } else if ((systolic > 180 && diastolic > 120) || (systolic > 180 || diastolic > 120)) {
        totalPoints += 100;
    }

    const weightKg = weight * 0.453592;
    const heightM = height * 0.0254;
    const bmi = weightKg / (heightM * heightM);

    if (bmi >= 18.5 && bmi <= 24.9) {
        totalPoints += 0;
    } else if (bmi >= 25.0 && bmi <= 29.9) {
        totalPoints += 30;
    } else {
        totalPoints += 75;
    }

    if (history.includes("diabetes")) {
        totalPoints += 10;
    }
    if (history.includes("cancer")) {
        totalPoints += 10;
    }
    if (history.includes("alzheimers")) {
        totalPoints += 10;
    }

    let riskCategory;

    if (totalPoints <= 20) {
        riskCategory = "Low Risk";
    } else if (totalPoints <= 50) {
        riskCategory = "Moderate Risk";
    } else if (totalPoints <= 75) {
        riskCategory = "High Risk"; 
    } else {
        riskCategory = "Uninsurable";
    }
    

    res.json({totalPoints, riskCategory});
});

// Custom 404 page.
app.use((request, response) => {
  response.type('text/plain')
  response.status(404)
  response.send('404 - Not Found')
})

// Custom 500 page.
app.use((err, request, response, next) => {
  console.error(err.message)
  response.type('text/plain')
  response.status(500)
  response.send('500 - Server Error')
})

app.listen(port, () => console.log(
  `Express started at \"http://localhost:${port}\"\n` +
  `press Ctrl-C to terminate.`)
)
