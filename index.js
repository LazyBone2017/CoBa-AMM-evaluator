let tabs;
var globalUserData = [];
let tempUserData;
window.onload = setup();


function setup(){
	let storage = JSON.parse(localStorage.getItem("data"));
	if(storage != undefined)globalUserData = storage;
	tabs = document.getElementsByClassName("mItem");
	for(let i= 0; i < tabs.length; i++){
		//tabs[i].onclick = function(){changeTab(i)};
		tabs[i].innerHTML = i == tabs.length - 1 ? "EVALUATION" : header[i];
	}
	let transferBtn = document.getElementById("btnTransfer");
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
	document.getElementById("inputFile").addEventListener('change', function() { 
			var fr=new FileReader(); 
			console.log("CLICKED");
             		fr.onload=function(){ 
				let res = JSON.parse(fr.result); 
				console.log(res);
               			globalUserData = res;
				changeTab(5);
			}
			fr.readAsText(this.files[0]); 
        });
	changeTab(0);
}


function changeTab(index){
	let item = tabs[index];
	for(let i = 0; i < tabs.length; i++){
		if(i != index)tabs[i].style.background = "#CCCCCC";
	}
	item.style.background = "#EEEEEE";
	document.getElementById("subBoard").innerHTML = "";
	if(index == 0){
		tempUserData = [];
		document.getElementById("infoContainer").innerHTML = "Entry: " + (globalUserData.length + 1);
	}
	if(index != 5)loadTab(index);
	else evaluate();
}

function loadTab(index){
	let subBoard = document.getElementById("subBoard");
	subBoard.appendChild(generateForms(index));
	let button = document.createElement("button");
	button.innerHTML = "SUBMIT";
	button.onclick = function(){submitData(index)};
	subBoard.appendChild(button);

	let clearBtn = document.createElement("button");
	clearBtn.id = "clearBtn";
	clearBtn.innerHTML = "Clear entries";
	clearBtn.onclick = function(){globalUserData = []; changeTab(0)};
	subBoard.appendChild(clearBtn);
}

function generateForms(index){
	let form = document.createElement("form");
	let table = document.createElement("table");
	for(let i = 0; i <= content[index].length; i++){
		let tr = document.createElement("tr");
		tr.className = "tableRow";
		for(let j = 0; j < 7; j++){
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
				let radio = document.createElement("input");
				radio.type = "radio";
				radio.id = i + "r" + j;
				radio.name = "r" + i;;
				radio.value = j;
				/*if(j == 3)radio.checked = true; //both for testing
				if(getRandomInt(5) == 1)radio.checked = true;*/
				td.appendChild(radio);
				td.onclick = function(){radio.checked = true;};
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
	//console.log(data);
	if(data.includes(-1)){
		alert("You have to fill out the whole list in order to continue");
		return;
	}
	tempUserData.push(...data);
	if(index == 4){
		//console.log(tempUserData);
		globalUserData[globalUserData.length] = tempUserData;
		//document.getElementById("fullscreenContainer").style.display = "block";

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
	else changeTab(index + 1);
}

function evaluate(){
	console.log(globalUserData);
	localStorage.setItem("data", JSON.stringify(globalUserData));
	window.open("eval.html", true);
}

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

function importData(){
	//if(!confirm("Current entries will be overwritten in the importing process. Proceed?"))return;
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

