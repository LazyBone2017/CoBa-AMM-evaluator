let tabs;
var globalUserData = [];
let tempUserData;
window.onload = setup();

//standard page setup
function setup(){
	let sessionType = localStorage.getItem("sessionType"); //determines what functionality is being used
	if(sessionType == undefined){
		sessionType = 0;  //manual data input mode
		localStorage.setItem("sessionType", 0);
	}
	let storage = JSON.parse(localStorage.getItem("data"));
	if(storage != undefined)globalUserData = storage; //retrieves user data from other page
	tabs = document.getElementsByClassName("mItem");
	let tabContent = document.getElementsByClassName("mItemContent"); //adds menuItems
	for(let i= 0; i < tabContent.length; i++){
		//tabs[i].onclick = function(){changeTab(i)}; //debug
		tabContent[i].innerHTML = i == tabs.length - 1 ? "EVALUATION" : header[i];
	}
	let transferBtn = document.getElementById("btnTransfer");
	if(sessionType == 2){ //button only accessible in mode 0
		transferBtn.style.display = "none";
		document.getElementById("infoContainer").style.display = "none";
	}
	transferBtn.onclick = function(){
		object = {
			prompt: "What do you want to do?",
			btn0txt: "Export Datasheet",
			btn1txt: "Import Datasheet",
			btn0fct: exportData,
			btn1fct: importData
		};
		loadPopup();
	}
	tippy(transferBtn, {
		content: "Export or import complete data files.",
		followCursor: true,
		duration: [100, 0],
		arrow: false,
		theme: "CoBa",
		offset: [140, 0],
		maxWidth: 280
	})	
	
	//imports external file and assigns content to GUD
	document.getElementById("inputFile").addEventListener('change', function() {  //get import file
			var fr=new FileReader(); 
            fr.onload=function(){
				let val = fileValidation(fr.result, 1); //check for corruption
				if(val == false){
					object = {
						prompt: "This file has been found corrupted.",
						btn0txt: "INVISIBLE",
						btn1txt: "Ok",
						btn0fct: function() {},
						btn1fct: function() {
							document.getElementById("GFC").style.display = "none";
							let btn = document.getElementById("GB0");
							btn.style.display = "inline-block";
						}
					};
					document.getElementById("GB0").style.display = "none";
					loadPopup();
					return;
				}
				globalUserData = val;
				changeTab(5); //go to evaluation
			}
			fr.readAsText(this.files[0]); 
    });
	changeTab(0);
}

//changes color of selected menuItem, resets for index = 0, calls evaluation() for index = 5 
function changeTab(index){
	let item = tabs[index];
	for(let i = 0; i < tabs.length; i++){
		if(i != index)tabs[i].style.background = "#CCCCCC";
	}
	item.style.background = "white";
	document.getElementById("subBoard").innerHTML = "";
	if(index == 0){
		tempUserData = [];
		document.getElementById("infoContainer").innerHTML = "Entry: " + (globalUserData.length + 1);
	}
	if(index != 5)loadTab(index);
	else evaluate();
}

//generates buttons and labels
function loadTab(index){
	let subBoard = document.getElementById("subBoard");
	subBoard.appendChild(generateForms(index));
	let button = document.createElement("button");
	button.id = "submitBtn";
	button.innerHTML = "SUBMIT";
	button.onclick = function(){submitData(index)};
	subBoard.appendChild(button);

	let clearBtn = document.createElement("button");
	clearBtn.id = "clearBtn";
	clearBtn.innerHTML = "CLEAR ENTRIES";
	clearBtn.onclick = function(){
		object = {
			prompt: "Current data will be deleted. Proceed?",
			btn0txt: "CANCEL",
			btn1txt: "PROCEED",
			btn0fct: function(){document.getElementById("GFC").style.display = "none";},
			btn1fct: function(){
				document.getElementById("GFC").style.display = "none";
				globalUserData = []; 
				localStorage.setItem("data", JSON.stringify(globalUserData)); //resets localStorage
				changeTab(0);
			}
		};
		loadPopup();
	}
	let sessionType = localStorage.getItem("sessionType");
	if(sessionType == 1)subBoard.appendChild(clearBtn);
	
	let menuBtn = document.createElement("button");
	menuBtn.id = "menuBtn";
	menuBtn.innerHTML = "BACK TO MENU";
	menuBtn.onclick = function() {
		object = {
			prompt: "Current data will be deleted. Proceed?",
			btn0txt: "CANCEL",
			btn1txt: "PROCEED",
			btn0fct: function(){document.getElementById("GFC").style.display = "none";},
			btn1fct: function(){
				document.getElementById("GFC").style.display = "none";
				localStorage.setItem("sessionType", -1); //prevents menu.js from reopening index.js because of Promises
				window.open("../html/menu.html", "_self");
			}
		};
		loadPopup();
		
	};
	subBoard.appendChild(menuBtn);
	
}

//returns form with tables and stuff 
function generateForms(index){
	let form = document.createElement("form");
	let table = document.createElement("table");
	for(let i = 0; i <= content[index].length; i++){
		let tr = document.createElement("tr");
		tr.className = "tableRow";
		if(i == 0)tr.style.background = "#ffcc33"; //coba yellow for header
		else if(i % 2 == 0)tr.style.background = "#e6e6e6";
		for(let j = 0; j < 7; j++){ //number of columns
			let td = document.createElement("td");
			let wrapper = document.createElement("div");
			if(i == 0){
				if(j == 0){wrapper.innerHTML = "INDICATOR"; td.className = "ttf";}
				else wrapper.innerHTML = j != 6 ? j : "N/A";	
				td.appendChild(wrapper);
				tr.appendChild(td);
				continue;
			}
			if(j == 0){
				wrapper.innerHTML = content[index][i - 1];
				td.className = "ttf";
				td.appendChild(wrapper);
			}
			else {
				//radio buttons
				let radio = document.createElement("input");
				radio.type = "radio";
				radio.id = i + "r" + j;
				radio.className = "trb";
				radio.name = "r" + i;;
				radio.value = j;
				/*if(j == 3)radio.checked = true; //both for testing
				if(getRandomInt(5) == 1)radio.checked = true;*/
			
				td.appendChild(radio);
				td.onclick = function(){radio.checked = true;}; //easier access to button
			}
			tr.appendChild(td);	
		}
		table.appendChild(tr);
		form.appendChild(table);
	}
	return form;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//adds data of the form to tempUserData, pushes tempUserData to GUD for index = 5, exports for sessionType != 0 tempUserData to file
function submitData(index){ 
	let data = [];
	let rows = document.getElementsByClassName("tableRow");
	for(let i = 1; i < rows.length; i++){
		let inputs = rows[i].getElementsByTagName("input");
		for(let j = 0; j < inputs.length; j++){
			if(inputs[j].checked)data[i - 1] = inputs[j].value;
		}
		if(data.length == i - 1)data[i - 1] = -1;
	}
	if(data.includes(-1)){
		alert("You have to fill out the whole list in order to continue");
		return;
	}
	tempUserData.push(...data);
	if(index == 4){
		tempUserData.splice(0, 0, false);
		if(localStorage.getItem("sessionType") == 0){
			globalUserData[globalUserData.length] = tempUserData;
			object = {
				prompt: "Do you want to evaluate? You will not be able to add more data afterwards.",
				btn0txt: "Add more data",
				btn1txt: "Evaluate",
				btn0fct: function(){
						document.getElementById("GFC").style.display = "none";
						changeTab(0);
						},
				btn1fct: function(){
						document.getElementById("GFC").style.display = "none";
						changeTab(5);
						}
			}
			loadPopup();
		}
		else {
			exportSingleFile();
			
		}
	}
	else changeTab(index + 1);
}

//loads GUD into localStorage
function evaluate(){
	console.log(globalUserData);
	localStorage.setItem("data", JSON.stringify(globalUserData));
	window.open("eval.html", "_self");
}

//opens download window for full export
function exportData(){
	object = {
		prompt: "Only completed entries will be exported. Proceed?",
		btn0txt: "Cancel",
		btn1txt: "Proceed",
		btn0fct: function(){document.getElementById("GFC").style.display = "none";},
		btn1fct: function(){
			let name = "AMM_DATA_" + getDate();
			downloadContent(name + ".json", JSON.stringify(globalUserData));
			document.getElementById("GFC").style.display = "none";
		}
	};
	loadPopup();
}

//opens download window for userFile export
function exportSingleFile(){
	console.log(tempUserData);
	object = {
		prompt: "Do you want to export as Master File?",
		btn0txt: "No",
		btn1txt: "Yes",
		btn0fct: function(){
			let name = "exampleUser_personal_AMM.json";
			downloadContent(name, JSON.stringify(tempUserData));
			document.getElementById("GFC").style.display = "none";
			changeTab(0);
			},
		btn1fct: function(){
			tempUserData[0] = true;
			let name = "exampleUser_personal_AMM.json";
			downloadContent(name, JSON.stringify(tempUserData));
			document.getElementById("GFC").style.display = "none";
			changeTab(0);
			}
	};
	loadPopup();	
}

//clicks input
function importData(){
	object = {
		prompt: "Current entries will be overwritten in the importing process. Proceed?",
		btn0txt: "Cancel",
		btn1txt: "Proceed",
		btn0fct: function(){document.getElementById("GFC").style.display = "none";},
		btn1fct: function(){
			document.getElementById("inputFile").click();
			document.getElementById("GFC").style.display = "none";
		}
	};
	loadPopup();
	
}

function getDate(){
	let date = new Date();
	let day = date.getDate() + "";
	let month = date.getMonth() + "";
	let year = (date.getFullYear() + "").slice(0, 2);
	if(month.length == 1)month = 0 + month;
	if(day.length == 1)day = 0 + day;
	return day + month + year;
}

function downloadContent(name, content) {
  var atag = document.createElement("a");
  var file = new Blob([content], {type: 'text/plain'});
  atag.href = URL.createObjectURL(file);
  atag.download = name;
  atag.click();
}

