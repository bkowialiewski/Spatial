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
  ref = database.ref('TEST');

  function validate()
  {

    // non-radio variables
    var name = document.getElementsByName('age');
    var educ = document.getElementsByName('educ');

    // radio variables

    var gender_radio = document.getElementsByName('genderS');
    for (var i = 0, length = gender_radio.length; i < length; i++)
    {
      if (gender_radio[i].checked)
      {
        var gender = gender_radio[i].value;
      }
    }

    var vision_radio = document.getElementsByName('vision');
    for (var i = 0, length = vision_radio.length; i < length; i++)
    {
      if (vision_radio[i].checked)
      {
        var vision = vision_radio[i].value;
      }
    }

    var lat_radio = document.getElementsByName('lat');
    for (var i = 0, length = lat_radio.length; i < length; i++)
    {
      if (lat_radio[i].checked)
      {
        var lat = lat_radio[i].value;
      }
    }

    var neur_radio = document.getElementsByName('neur');
    for (var i = 0, length = neur_radio.length; i < length; i++)
    {
      if (neur_radio[i].checked)
      {
        var neur = neur_radio[i].value;
      }
    }

    var app_radio = document.getElementsByName('app');
    for (var i = 0, length = app_radio.length; i < length; i++)
    {
      if (app_radio[i].checked)
      {
        var app = app_radio[i].value;
      }
    }

    var data = {
      age: age.value,
      educ: educ[0].value,
      gender: gender,
      vision: vision,
      lat: lat,
      neur: neur,
      app: app
    }
    ref.push(data);

  }