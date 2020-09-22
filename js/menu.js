window.onload = setup();
let compFiles = 0;

//defines sessionType and redirects
function redirect(index){
	localStorage.setItem("sessionType", index);
	switch(index) {
		case 1: {
			//open import module, redirect with type=1;
			importFiles();
			break;
		}
		case 2:{
			//redirect with type=2;
			window.open("../html/index.html", "_self");
			break;
		}
		case 3: {
			getCompFiles();
			break;
		}
		default: {
			//redirect with type=0;
			localStorage.clear();
			window.open("../html/index.html", "_self");
		}
	}
}

function importFiles(){
	document.getElementById("inputFile").click();
}

//basic setup of website and inputs
function setup(){
	let GUD = [];
	document.getElementById("inputFile").addEventListener('change', function() { 
		if(this.files.length < 2){
			alert("The application needs at least 2 files in order to work properly.");
			return;
		}
		let promises = [];
		for (let file of this.files) {
			let filePromise = new Promise(resolve => {
				let reader = new FileReader();
				reader.fileName = file.name;
				reader.readAsText(file);
				reader.onload = function(ev) {
					let p = fileValidation(reader.result, 0); //checks for corruption
					console.log("p:");
					console.log(p);
					if(p == false){ //currupted files evaluate to 'filename' + "FAILED"
						console.log(reader.fileName + " FAILED!");
						p = reader.fileName + " FAILED!";
					}
					resolve(p);
				}
			});
			promises.push(filePromise);
		}
    Promise.all(promises).then(fileContents => {
		console.log("CONT");
		console.log(fileContents);
		let corrupts = "";
		for(let item of fileContents){ //adds corrupted files to list
			if(item.includes("FAILED")){
				corrupts += item.replace(" FAILED!", "") + "<br>";
			}
		}
		//displays corrupted files
		if(corrupts.length > 0){
			object = {
				prompt: "The following files have been found corrupted:<br>" + corrupts,
				btn0txt: "INVISIBLE",
				btn1txt: "Ok",
				btn0fct: function(){},
				btn1fct: function(){
					document.getElementById("GB0").style.display = "inline-block";
					document.getElementById("PUTG").style.overflowY = "hide";
					document.getElementById("GFC").style.display = "none";
					
				}
			}
			document.getElementById("GB0").style.display = "none";
			document.getElementById("PUTG").style.overflowY = "scroll";
			loadPopup();
			return;
		}
		
		//loads retrieved data into sessionStorage and redirects  to eval.html
		if(localStorage.getItem("sessionType") == -1)return; //prevents unwanted redirect to eval.html
		GUD.push(...fileContents);
		localStorage.setItem("data", JSON.stringify(GUD));
		localStorage.setItem("sessionType", 1);
		window.open("../html/eval.html", "_self"); 
		});
	});
	let btns = document.getElementsByClassName("mBtn");
	for(let i = 0; i < btns.length; i++){
		tippy(btns[i], {
		content: buttonTooltips[i],
		followCursor: true,
		duration: [100, 0],
		arrow: false,
		theme: "CoBa",
		offset: [140, 0],
		maxWidth: 280
		});
	}
	
	//compInputs, checks for both being loaded
	let inputL = document.getElementById("fileL");
	let inputR = document.getElementById("fileR");
	inputL.addEventListener('change', function() { 
		document.getElementById("labelL").innerHTML = this.files[0].name;
		if(inputR.files.length != 0){
			openComp([this.files[0], inputR.files[0]]);
		}
	});
	inputR.addEventListener('change', function() { 
		document.getElementById("labelR").innerHTML = this.files[0].name;
		if(inputL.files.length != 0){
			openComp([inputL.files[0], this.files[0]]);
		}
	});
}

//reads data from compInputs, validates as @index.js
function openComp(files){
	let promises = [];
	let fileNames = [files[0].name, files[1].name];
	for(file of files){
		let promise = new Promise(resolve => {
			let reader = new FileReader();
			reader.fileName = file.name;
			reader.readAsText(file);
			reader.onload = () => {
				let val = fileValidation(reader.result, 1);
				if(val == false){
					console.log(reader.fileName + " FAILED!");
					val = reader.fileName + " FAILED!";
				}
				resolve(val);
			}
		});
		promises.push(promise);
	}
	Promise.all(promises).then(fileContents => {
		let corrupts = "";
		for(let item of fileContents){
			if(item.includes("FAILED")){
				corrupts += item.replace(" FAILED!", "") + "<br>";
			}
		}
		if(corrupts.length > 0){
			if(corrupts.length > 0){
			object = {
				prompt: "The following files have been found corrupted:<br>" + corrupts,
				btn0txt: "INVISIBLE",
				btn1txt: "Ok",
				btn0fct: function(){},
				btn1fct: function(){
					/*document.getElementById("GB0").style.display = "inline-block";
					document.getElementById("PUTG").style.overflowY = "hide";
					document.getElementById("GFC").style.display = "none";
					let inc = 1;
					for(label of document.getElementsByClassName("compFileLabel")){
						label.innerHTML = "CHOOSE FILE " + inc++;
						compFiles = 0;
					}*/
					location.reload();
				}
			}
			document.getElementById("GB0").style.display = "none";
			let PUTG = document.getElementById("PUTG");
			if(PUTG.scrollHeight > PUTG.innerHeight) document.getElementById("PUTG").style.overflowY = "scroll";
			loadPopup();
			return;
			}
		}
		//sends filenames and fileContents to comp.html
		sessionStorage.setItem("fileNames", JSON.stringify(fileNames));
		sessionStorage.setItem("compData", JSON.stringify(fileContents));
		window.open("../html/comp.html", "_self");
	});
	
}

//turns labels visible
function getCompFiles() {
	for(label of document.getElementsByClassName("compFileLabel")){
		label.style.opacity = 1;
		label.disabled = false;
	}
	document.getElementById("fileL").disabled = false;
	document.getElementById("fileR").disabled = false;
}