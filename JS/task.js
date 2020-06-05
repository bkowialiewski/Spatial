// main variables, especially for the grid
var hgt = window.innerHeight*0.9;
var wdt = hgt;

var n = 6;
var sRect = wdt/10;
var sSpace = sRect*0.375;
var actualCol = 255*0.75;
var allSquare = [];
var xmin = [];
var xmax = [];
var ymin = [];
var ymax = [];

// temporal parameters
var wvalMax = 1000;
var wvalEnc = 500;
var wvalEncTemp = wvalEnc;
var wvalRec = 350;
var time = 0;

// counters and flags
var cntEnc = 0;
var cntRec = 0;
var cntTrial = 0;
var pres = 1;
var clicked = 0;
var begin = 1;
var instructions = 1;

// coordinates
var indX = 0, indY = 0;
var coordX = 0, coordY = 0;
var correctionx;
var correctiony;
var numCoord = [];

// variables related to the data processing
var table;
var responses = [];
var latencies = [];

// pre-load the table
function preload() {
	table = loadTable('sequences/version_1.csv', 'csv', 'header');
}

// set up the overall basic parameters before launching the experiment
function setup() {

  // Your web app's Firebase configuration
  var firebaseConfig = {
  	apiKey: "AIzaSyCTWzTzYQSvcIIaKwdHoyld33SMoea-ZsY",
  	authDomain: "spatial-ae158.firebaseapp.com",
  	databaseURL: "https://spatial-ae158.firebaseio.com",
  	projectId: "spatial-ae158",
  	storageBucket: "spatial-ae158.appspot.com",
  	messagingSenderId: "627158627379",
  	appId: "1:627158627379:web:ba0ec4bc9e30e069d51f46"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();
  ref = database.ref('scores');

  canvas = createCanvas(wdt, hgt);
  canvas.parent('task');

	// define the position of each square
	for (var i = 0; i < n; i++)
	{
		numCoord[i] = [];
		for (var j = 0; j < n; j++)
		{
			numCoord[i][j] = (1+j)+(6*i);
		}
	}

	// pre-allocate memory for the responses and the latencies
	for (var i = 0; i < table.getRowCount(); i++)
	{
		responses[i] = [];
		latencies[i] = [];
		for (var j = 0; j < n; j++)
		{
			responses[i][j] = 0;
		}		
		for (var j = 0; j < n+1; j++)
		{
			latencies[i][j] = 0;
		}
	}

	// create the data structure and save it in the database
	var data = {
		name: "DTS",
		latencies: latencies,
		responses: responses
	}
	ref.push(data);

	cntTrial = 0;
	time = millis();

}

// main loop
function draw()
{

  print(instructions)

  // begininng of the experiment
  if (instructions == 1)
  {
    background(255);
    textSize(hgt*0.033);
    fill(0);
    textAlign(CENTER);
    text("L'expérience va commencer. \n Veuillez cliquer pour démarrer. \n \n Pour rappel, si vous oubliez un item, \n cliquez en dehors de l'écran (bande noire).", wdt/2, hgt/2);
    return
  } else if (instructions == 2)
  {
    if (millis() - time >= 4000)
    {
      time = millis();
      instructions = 0;
    }
    return
  }

	// we log the beginning of the trial
	if (cntEnc == n && cntRec == 0)
	{
		latencies[cntTrial][cntRec] = millis();
	}

	if (begin == 1)
	{
		if (millis() - time >= 1000)
		{
			num = table.get(cntTrial, 0);
			findCoord(num);
			begin = 0;
			time = millis();
		}
	} else if (cntEnc < n)
	{
		encoding();
	} else if (cntRec < (n+1)) {
		recall();
	} else if (cntRec == (n+2))
	{

    	// when both periods are finished, clean up everything
    	makeBackground();
    	cntTrial ++;
    	cntEnc = 0;
    	cntRec = 0;
    	pres = 1;
    	wvalEnc = wvalEncTemp;
    	begin = 1;
    	time = millis();
    }
  }

  function encoding()
  {

   noCursor();

  // are we on the presentation of the item or during a inter-stimulis interval?
  if (pres == 1)
  {
    // stimulus appears
    fill(0);
  } else if (pres == 0)
  {
    // stimulus disappears
    fill(actualCol);
  }

  	// display
  	noStroke();
  	rect(allSquare[coordY], allSquare[coordX], sRect, sRect);

  	// if time has elapsed, we change the time to wait and the type of presentation
  	// plus, increment the encoding period
  	if (millis() - time >= wvalEnc)
  	{
  		wvalEnc = wvalMax - wvalEnc;
  		pres = abs(1-pres);
  		time = millis();
  		if (pres == 1)
  		{
  			cntEnc ++;
  			num = table.get(cntTrial, cntEnc);
  			findCoord(num);
  		}
  	}
  }

  function recall()
  {

  	cursor();
  // if a click happened... if not...
  if (clicked == 1)
  {
  	fill(0);
  } else
  {  
  	fill(255*0.75);
  }

  if (millis() - time >= wvalRec)
  {
  	time = millis();
  	clicked = 0;
  }

  if (indX != 999 && indY != 999)
  {
    // draw the rectangle
    noStroke();
    rect(allSquare[indX], allSquare[indY], sRect, sRect);
  }

  
}

function mousePressed()
{

  if (instructions == 1)
  {
    instructions = 2;
    makeBackground();
    time = millis();
    return
  }

  if ((cntRec < n) && (cntEnc >= (n)))
  {

    	// the system has to know that a click happened
    	latencies[cntTrial][cntRec+1] = millis();
    	clicked = 1;
    	cntRec ++;

    	// we must get the coordinates of this click
    	for (var i = 0; i < allSquare.length; i++)
    	{
    		if (mouseX > xmin[i] && mouseX < xmax[i])
    		{
    			indX = i;
    		}

        if (mouseY > ymin[i] && mouseY < ymax[i])
        {
         indY = i;
       }
     }

     if (mouseX < xmin[i] || mouseX > xmax[n-1] || mouseY < ymin[i] || mouseY > ymax[n-1])
     {
      indX = 999;
      indY = 999;
    }
    if (mouseX < 0 || mouseY < 0 || mouseX > wdt || mouseY > hgt)
    {
      indX = 999;
      indY = 999;
    }

  } else if (cntRec == n) {
   background(255);
   textSize(hgt*0.033);
   fill(0);
   textAlign(CENTER);
   text("Cliquez pour passer à l'essai suivant.", wdt/2, hgt/2);

   cntRec ++;
 } else if (cntRec == (n+1)) {
   background(255);
   cntRec ++;
 }
}

// this function is simply convenient to get the coordinates from a number
function findCoord(num)
{
	for (var i = 0; i < n; i++)
	{
		for (var j = 0; j < n; j++)
		{
			if (numCoord[i][j] == num)
			{
				coordX = i;
				coordY = j;
				break;
			}
		}
	}
}

// simply set up the main background
function makeBackground()
{

	background(255);

	allSquare[0] = 0;
	for (var i = 1; i < n; i++)
	{
		allSquare[i] = (allSquare[i-1] + (sRect + sSpace));
	}

	correction = (hgt - ((sRect+sSpace)*n) + sSpace)/2;

	for (var i = 0; i < n; i++)
	{

		allSquare[i] += correction;

		xmin[i] = allSquare[i] - (sSpace/2);
		xmax[i] = allSquare[i] + sRect + (sSpace/2);

		ymin[i] = allSquare[i] - (sSpace/2);
		ymax[i] = allSquare[i] + sRect + (sSpace/2);
	}

	for (var i = 0; i < n; i++)
	{
		for (var j = 0; j < n; j++)
		{
			noStroke();
			fill(255*0.75);
			rect(allSquare[i], allSquare[j], sRect, sRect);
		}
	}
}