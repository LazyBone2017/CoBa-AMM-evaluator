let tabs;
var globalUserData = [];
let tempUserData;
window.onload = setup();


function setup(){
	tabs = document.getElementsByClassName("mItem");
	for(let i= 0; i < tabs.length; i++){
		tabs[i].onclick = function(){changeTab(i)};
		tabs[i].innerHTML = i == tabs.length - 1 ? "EVALUATION" : header[i];
	}
	let addBtn = document.getElementById("btnAdd");
	addBtn.onclick = function(){
		document.getElementById("fullscreenContainer").style.display = "none";
		changeTab(0);
	}
	let evalBtn = document.getElementById("btnEval");
	evalBtn.onclick = function(){
		document.getElementById("fullscreenContainer").style.display = "none";
		changeTab(5);
	}
	let transferBtn = document.getElementById("btnTransfer");
	transferBtn.onclick = function(){
		if(confirm("Export?")){
			exportData();
		}
		else importData();
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
				if(j == 0){wrapper.innerHTML = "HEADERTXT"; td.className = "ttf";}
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
				if(j == 3)radio.checked = true; //both for testing
				if(getRandomInt(5) == 1)radio.checked = true;
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
		document.getElementById("fullscreenContainer").style.display = "block";
		
	}
	else changeTab(index + 1);
}

function evaluate(){
	console.log(globalUserData);
	localStorage.setItem("data", JSON.stringify(globalUserData));
	window.open("eval.html", false);
}

function exportData(){
	if(!confirm("Only completed entries will be exported. Proceed?"))return;
	let name = "AMM_DATA_" + getDate();
	downloadContent(name + ".json", JSON.stringify(globalUserData));
	
}

function importData(){
	if(!confirm("Current entries will be overwritten. Proceed?"))return;
	document.getElementById("inputFile").click();
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

