/* SETTINGS */
const questionsPerQuiz = 15;
const difficultyScore = {
        "easy": 1,
        "medium": 3,
        "hard": 5
    };
const timeBetweenQuestions = 2000; //in milliseconds
const categoryAPI = "https://opentdb.com/api_category.php";
const quizAPI = `https://opentdb.com/api.php?amount=${questionsPerQuiz}&category=`;

/* APP VARIABLES */
let category, quiz, question, score;
      
/* PAGE LOAD */
document.addEventListener("DOMContentLoaded", init);
function init(){
	//this function runs once when the page loads
  	getCategories();
}
      
/* API CALLS */
function getCategories(){
	fetch(categoryAPI).then(res => res.json()).then(gotCategories);
}
function getQuiz(categoryId){
	fetch(quizAPI + categoryId).then(res => res.json()).then(gotQuiz);
}
      
/* API RESPONSES */
function gotCategories(data){
  	let html = "<h2>Select a Category:</h2>";
	for (let category of data.trivia_categories){
    	//e.g. {"id":9,"name":"General Knowledge"}
      	html += `<button class="w3-button w3-ripple w3-light-grey w3-padding" data-id="${category.id}">${category.name}</button>`;
    }
  	document.querySelector("header nav").innerHTML = html;
  	for (let button of document.querySelectorAll("header nav button")){
    	button.addEventListener("click", handleNavButtonClick);
    }
}
function gotQuiz(data){
	quiz = data.results; //quiz is an array of questionsPerQuiz (15) questions
  	score = 0; //reset score
  	category = quiz[0].category; //save category for end screen
  	document.querySelector("header nav").classList.add("hidden"); //hide the nav until quiz is over
	loadQuestion();
}
      
/* EVENT HANDLERS */
function handleNavButtonClick(e){
	let categoryId = e.target.getAttribute("data-id");
  	getQuiz(categoryId);
}
function handleAnswerButtonClick(e){
	//get user's answer
  	let answer = e.target.textContent; //get text of button
  	//check if it's correct or incorrect
  	if (answer === question.correct_answer){
    	//correct!
      	score += difficultyScore[question.difficulty];
      	document.querySelector("main footer").textContent = "Correct!";
    }
  	else {
    	//incorrect...:(
      	document.querySelector("main footer").textContent = "Incorrect...";
    }
  	//wait...then show next question
  	setTimeout(loadQuestion, timeBetweenQuestions);
}
function handleSaveNameButtonClick(e){
	let name = document.querySelector("main input").value.trim();
  	if (!name) return; //do nothing if there's no name
  	addToLeaderBoard(category, name, score);
  	getLeaderboard();
}

/* APP LOGIC */
function loadQuestion(){
  	//is game over?
  	if (!quiz.length) return gameOver();
  	//game is NOT over yet...
	question = quiz.pop(); //remove last question from quiz array
  	let html = `<h2>${question.question}</h2>`;
  	if (question.type === "boolean"){
    	//true-false
      	html += `
			<button class="w3-button w3-ripple w3-green w3-padding">True</button>
			<button class="w3-button w3-ripple w3-green w3-padding">False</button>
		`;
    }
  	else {
    	//multiple choice
      	let answers = question.incorrect_answers.slice(0); //copy
      	answers.push(question.correct_answer);
        answers = shuffle(answers);
      	for (let answer of answers){
        	html += `<button class="w3-button w3-ripple w3-green w3-padding">${answer}</button>`;
        }
    }
  	html += "<footer></footer>"; //this will hold correct/incorrect notification
  	//add HTML to the DOM
  	document.querySelector("main").innerHTML = html;
  	//add click listeners to all buttons
  	for (let button of document.querySelectorAll("main button")){
    	button.addEventListener("click", handleAnswerButtonClick);
    }
}
function gameOver(){
	//show the nav again
  	document.querySelector("header nav").classList.remove("hidden");
  	document.querySelector("main").innerHTML = `
		<h2>You scored ${score} points!</h2>
		<input placeholder="Enter your name" /><button>Save</button>
		<footer></footer>
	`;
  	document.querySelector("main button").addEventListener("click", handleSaveNameButtonClick);
  	getLeaderboard();
}

/* STORAGE */
function getLeaderboard(){
    let html = "<h3>Leaderboard</h3>";

    // Get high scores
    var scoreArray = JSON.parse(localStorage.getItem("scoreArray"));
    html += "<ol>"
    for (i = 0; i < Math.min(10, scoreArray.length); i++) {
        html += "<li>" + scoreArray[i].n + " " + scoreArray[i].s + "</li>"
    };

    document.querySelector("main footer").innerHTML = html;
}

function addToLeaderBoard(category, name, score){
    let player = {c:category, n:name, s:score};
    var oldScores = JSON.parse(localStorage.getItem("scoreArray"));
    var newScores = [];
    var higher = false;

    if (!oldScores) { //if high scores is blank
        newScores=[player]; 
    } else {
        // sort leaderboard
        for (i=0; i<oldScores.length; i++) { // loop over old high scores
            if (!higher) {
                if (player.s > oldScores[i].s) {
                    newScores[i] = player;
                    newScores[i+1] = oldScores[i];
                    higher = true;
                } else {
                    newScores[i] = oldScores[i];
                }
            } else {
                newScores[i + 1] = oldScores[i];
            }
        }
        if (!higher) {
            newScores[oldScores.length] = player
        }
    }
    localStorage.setItem("scoreArray", JSON.stringify(newScores));
}

/* HELPER FUNCTIONS */
function shuffle(arr){
	let clone = arr.slice(0); //shallow clone
  	let shuffled = [];
  	while (clone.length){
    	let randIndex = Math.floor(Math.random()*clone.length);
      	let randElement = clone.splice(randIndex, 1)[0];
      	shuffled.push(randElement);
    }
  	return shuffled;
}

