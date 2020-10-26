
const questionsPerQuiz = 15;
const difficultyScore = {
        "easy": 1,
        "medium": 3,
        "hard": 5
    };
const timeBetweenQuestions = 2000;
const categoryAPI = "https://opentdb.com/api_category.php";
const quizAPI = `https://opentdb.com/api.php?amount=${questionsPerQuiz}&category=`;


let category, quiz, question, score;
      

document.addEventListener("DOMContentLoaded", init);
function init(){
	
  	getCategories();
}


function getCategories(){
	fetch(categoryAPI).then(res => res.json()).then(gotCategories);
}
function getQuiz(categoryId){
	fetch(quizAPI + categoryId).then(res => res.json()).then(gotQuiz);
}
      

function gotCategories(data){
  	let html = "<h2>Select a Category:</h2>";
	for (let category of data.trivia_categories){
    	
      	html += `<button class="w3-button w3-ripple w3-light-grey w3-padding" data-id="${category.id}">${category.name}</button>`;
    }
  	document.querySelector("header nav").innerHTML = html;
  	for (let button of document.querySelectorAll("header nav button")){
    	button.addEventListener("click", handleNavButtonClick);
    }
}
function gotQuiz(data){
	quiz = data.results; 
  	score = 0; 
  	category = quiz[0].category; 
  	document.querySelector("header nav").classList.add("hidden"); 
	loadQuestion();
}
      

function handleNavButtonClick(e){
	let categoryId = e.target.getAttribute("data-id");
  	getQuiz(categoryId);
}
function handleAnswerButtonClick(e){
	
  	let answer = e.target.textContent; 
  	
  	if (answer === question.correct_answer){
    
      	score += difficultyScore[question.difficulty];
      	document.querySelector("main footer").textContent = "Correct!";
    }
  	else {
    	
      	document.querySelector("main footer").textContent = "Incorrect...";
    }
  	
  	setTimeout(loadQuestion, timeBetweenQuestions);
}
function handleSaveNameButtonClick(e){
	let name = document.querySelector("main input").value.trim();
  	if (!name) return; 
  	addToLeaderBoard(category, name, score);
  	getLeaderBoard();
}


function loadQuestion(){
  	
  	if (!quiz.length) return gameOver();
  	
	question = quiz.pop(); 
  	let html = `<h2>${question.question}</h2>`;
  	if (question.type === "boolean"){
    	
      	html += `
			<button class="w3-button w3-ripple w3-green w3-padding">True</button>
			<button class="w3-button w3-ripple w3-green w3-padding">False</button>
		`;
    }
  	else {
    
      	let answers = question.incorrect_answers.slice(0); 
      	answers.push(question.correct_answer);
        answers = shuffle(answers);
      	for (let answer of answers){
        	html += `<button class="w3-button w3-ripple w3-green w3-padding">${answer}</button>`;
        }
    }
  	html += "<footer></footer>"; 
  	
  	document.querySelector("main").innerHTML = html;
  	
  	for (let button of document.querySelectorAll("main button")){
    	button.addEventListener("click", handleAnswerButtonClick);
    }
}
function gameOver(){
	
  	document.querySelector("header nav").classList.remove("hidden");
  	document.querySelector("main").innerHTML = `
		<h2>You scored ${score} points!</h2>
		<input placeholder="Enter your name" /><button>Save</button>
		<footer></footer>
	`;
  	document.querySelector("main button").addEventListener("click", handleSaveNameButtonClick);
  	getLeaderboard();
}


function getLeaderboard(){
	document.querySelector("main footer").innerHTML = "Leaderboard from localStorage goes here...";
}
function addToLeaderBoard(category, name, score){
	console.log("add to leaderboard", category, name, score);
}
      

function shuffle(arr){
	let clone = arr.slice(0); 
  	let shuffled = [];
  	while (clone.length){
    	let randIndex = Math.floor(Math.random()*clone.length);
      	let randElement = clone.splice(randIndex, 1)[0];
      	shuffled.push(randElement);
    }
  	return shuffled;
}
