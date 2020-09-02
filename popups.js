var object = {prompt: "PROMPT", btn0txt: "btn0txt", btn1txt: "btn1txt", btn0Fct: -1, btn1Fct: -1};
object.seal;

function loadPopup(){
	let container = document.getElementById("GFC");
	/*document.body.addEventListener("keypress", (x) => {
		console.log(x.key);
        	//if(x.key === "Escape")console.log("YE");
    	});*/
	document.getElementById("PUTG").innerHTML = object.prompt;

	let btn0 = document.getElementById("GB0");
	btn0.innerHTML = object.btn0txt;
	btn0.onclick = object.btn0fct;
	
	let btn1 = document.getElementById("GB1");
	btn1.innerHTML = object.btn1txt;
	btn1.onclick = object.btn1fct;

	container.style.display = "block";
}

//structure
//let object = {prompt: "PROMPT", btn0txt: "Test", btn1txt: "Test2", btn0Fct: test(), btn1Fct: test1()};