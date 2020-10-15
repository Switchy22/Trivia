    var pageContent = document.querySelector("#page-content")
    
 
    const questionsPerQuiz = 15;
    const difficultyMultiplier = {
            "easy": 1,
            "medium": 3,
            "hard": 5
        };
    const categoryAPI = "https://opentdb.com/api_category.php";
    const quizAPI = `https://opentdb.com/api.php?amount=${questionsPerQuiz}&category=`;
    
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
          let html = "";
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
        console.log(data);
        for (i = 0; i < 15; i++) {
            var question = data.results[i]
            console.log(question);
            var questionEl = document.createElement("h3")
            questionEl.innerText = question.question;
            pageContent.appendChild(questionEl)
        }
    }
          
    /* EVENT HANDLERS */
    function handleNavButtonClick(e){
        let categoryId = e.target.getAttribute("data-id");
          getQuiz(categoryId);
    }
    
    /* STORAGE */
    
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
