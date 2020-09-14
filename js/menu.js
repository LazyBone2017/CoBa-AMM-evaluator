window.onload = setup();
let compFiles = 0;

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

function setup(){
	let GUD = [];
	document.getElementById("inputFile").addEventListener('change', function() { 
	let promises = [];
    for (let file of this.files) {
        let filePromise = new Promise(resolve => {
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => resolve(JSON.parse(reader.result));
        });
        promises.push(filePromise);
    }
    Promise.all(promises).then(fileContents => {
		if(localStorage.getItem("sessionType") == -1)return;
			GUD.push(...fileContents);
			console.log(GUD);
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
			openComp([this.files[0], inputL.files[0]]);
		}
	});
}

function openComp(files){
	let promises = [];
	for(file of files){
		let promise = new Promise(resolve => {
			let reader = new FileReader();
			reader.readAsText(file);
			reader.onload = () => resolve(JSON.parse(reader.result));
		});
		promises.push(promise);
	}
	Promise.all(promises).then(fileContents => {
		sessionStorage.setItem("compData", JSON.stringify(fileContents));
		window.open("../html/comp.html", "_self");
	});
	
}

function getCompFiles() {
	for(label of document.getElementsByClassName("compFileLabel")){
			label.style.opacity = 1;
		}
}