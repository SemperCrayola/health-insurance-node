const express = require('express');
const bodyParser = require('body-parser');


const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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

// Start the server and listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});