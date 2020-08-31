let tabs;
var globalUserData = [];
let tempUserData;
window.onload = setup();


function setup(){
	tabs = document.getElementsByClassName("mItem");
	for(let i= 0; i < tabs.length; i++)tabs[i].onclick = function(){changeTab(i)};
	let addBtn = document.getElementById("btnAdd");
	addBtn.onclick = function(){
		document.getElementById("fullscreenContainer").style.display = "none";
		changeTab(0);
	}
	let evalBtn = document.getElementById("btnEval");
	evalBtn.onclick = function(){
		console.log("TEST");
		document.getElementById("fullscreenContainer").style.display = "none";
		changeTab(5);
	}
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
	console.log(data);
	if(data.includes(-1)){
		alert("You have to fill out the whole list in order to continue");
		return;
	}
	tempUserData[index] = data;
	if(index == 4){
		console.log(tempUserData);
		globalUserData[globalUserData.length] = data;
		document.getElementById("fullscreenContainer").style.display = "block";
		
	}
	else changeTab(index + 1);
}

function evaluate(){
	
}
