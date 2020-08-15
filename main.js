  // declare variable
let count =document.querySelector('.count'),
    bullets_container=document.querySelector('.bullets'),
    bullet=document.querySelector('.bullets .spans'),
	questionarea=document.querySelector('.quiz-area'),
	answerarea=document.querySelector('.answers-area'),
	btn=document.querySelector('.submit-button'),
    countdownElement = document.querySelector(".countdown"),
	result_area=document.querySelector('.results'),
	currentIndex=0,
	right_answers=0,
	 countdownInterval ;
	
	// function to make request and get questions
	function getQuestions(){
		let myRequest=new XMLHttpRequest();
		myRequest.onreadystatechange=function(){
			if (this.readyState === 4 && this.status === 200){
				obj_Question=JSON.parse(this.responseText);
				counter=obj_Question.length;
				count.innerHTML=counter;
				bullets(counter);
				add_Question(obj_Question[currentIndex],counter);
				countdown(60,counter);
				// submit button
				btn.onclick=function(){
				let theRightAnswer=obj_Question[currentIndex].right_answer;
					currentIndex++;
					check_answer(theRightAnswer,counter);
					questionarea.innerHTML='';
					answerarea.innerHTML='';
					add_Question(obj_Question[currentIndex],counter);
					handlbullets();
					clearInterval(countdownInterval);
					countdown(60,counter);
					result(counter);
				}
				
			}
		}
		myRequest.open('GET',"questions.json" ,true);
	    myRequest.send();
	}
	getQuestions();
	// add questions function 
	function add_Question(obj,count){
		if(currentIndex < count){
		let question_title=document.createElement("h2");
		let question_text=document.createTextNode(obj['title']);
		question_title.appendChild(question_text);
		questionarea.appendChild(question_title);
		for(let i=1 ;i<=3 ;i++){
		let answer=document.createElement("div");
		answer.className='answer';
		let radio_input =document.createElement("input");
		radio_input.name='question';
		radio_input.type='radio';
		radio_input.id=`answer_${i}`;
		radio_input.dataset.answer=obj[`answer_${i}`];
		let label_title=document.createElement('label');
		label_title.htmlFor='answer_${i}';
	    let label_text=document.createTextNode(obj[`answer_${i}`]);
		label_title.appendChild(label_text);
		answer.appendChild(radio_input);
		answer.appendChild(label_title);
		answerarea.appendChild(answer);
		}
		}
	}
	// check answers function
	function check_answer(r_answer,count){
		let answers=document.getElementsByName('question');
		let the_choise;
		for(let i=0 ;i< answers.length ;i++){
			if(answers[i].checked){
				the_choise=answers[i].dataset.answer;
			}	
		}
		if(r_answer === the_choise){
			right_answers++;
		}
		
	}
	// function resulte and grade
	function result(count){
		if(currentIndex === count){
		questionarea.innerHTML='';
		answerarea.innerHTML='';
		btn.remove();
		bullets_container.remove();
		if(right_answers > 5 && right_answers < 10  ){
			result_area.innerHTML=`that was good <br> 
			                       your grade is: ${right_answers}/${count}` ;
			
		}
		else if(right_answers === 10){
			result_area.innerHTML=`congratulations <br> 
			                       your grade is: ${right_answers}/${count}` ;
		}
		else  {
			result_area.innerHTML=`that was bad <br> you can do much better next time <br>
			                       your grade is: ${right_answers}/${count} `;
		}
		}
	}
	//creat bullets 
	function bullets(n){
	for(let i=0 ;i<n ;i++){
		let bulls=document.createElement("span");
		if(i===0){
			bulls.className='on';
		}
		bullet.appendChild(bulls);
	}
	
}
// handle bullets
function handlbullets(){
	let allbull=document.querySelectorAll('.bullets .spans span');
	let arrspan=Array.from(allbull);
	arrspan.forEach((span,index) => {
		if(currentIndex === index){
			
			span.className='on';
		}
	})
	
}
// countdown function 
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        btn.click();
      }
    }, 1000);
  }
}
