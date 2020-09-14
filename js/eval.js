let averages = [];
let data;
let masterFile = false;
let criticalDifference = 1;
window.onload = setup();

function setup(){
	data = JSON.parse(localStorage.getItem("data"));
	console.log(data);
	let mFileIndex = findMasterFile();
	console.log(mFileIndex);
	for(let i = 1; i < data[0].length; i++){
		let avg = 0;
		let nas = 0;
		 for(let j = 0; j < data.length; j++){
			let val = parseInt(data[j][i]);
			if(val == 6 || j == mFileIndex)nas++;
			else avg += val;
			//avg += val == 6 ? 0 : val;
		}
		averages.push((avg / (data.length - nas)).toFixed(2));
		
	}
	createPopup2(mFileIndex);
	
	console.log(averages);
		
}

function findMasterFile(){
	let index = -1;
	for(let i = 0; i < data.length; i++){
		if(data[i][0] == true){
			if(!masterFile){
				masterFile = true;
				index = i;
			}
			else throw "More than 1 master file";
		}
	}
	return index;
}

function generateTables(mFileIndex){
	let x = 0;
	for(let i = 0; i < content.length; i++){
		let table = document.createElement("table");
		table.id = "table" + i;
		table.className = "tables";
		if(i != 0)table.style.display = "none";
		
		let tr = document.createElement("tr");
		let td0 = document.createElement("td");
		td0.className = "tdh";
		td0.innerHTML = "<div class=\"hd0\">INDICATOR</div>";
		
		let td1 = document.createElement("td");
		td1.className = "tdh";
		td1.innerHTML = "<div class=\"hd1\">AVERAGE SCORE</div>";
		
		let td2 = document.createElement("td");
		td2.className = "tdh";
		td2.innerHTML = "<div class=\"hd1\">COMPARATIVE</div>"; //hd1 is expected, not a mistake
		
		tr.appendChild(td0);
		tr.appendChild(td1);
		if(masterFile)tr.appendChild(td2);
		table.appendChild(tr);
		
		
		for(let j = 0; j < content[i].length; j++){
			let tr = document.createElement("tr");
			if(j %  2 == 1)tr.style.background = "#e6e6e6";
			let critical = Math.abs(data[masterFile ? mFileIndex : 0][x + 1] - averages[x]) >= criticalDifference;
			if(critical)tr.style.background = "#f55742";
			
			let exp = document.createElement("td");
			exp.className = "expTd";

			let div = document.createElement("div");
			div.innerHTML = content[i][j];
			
			let value = document.createElement("td");
			value.innerHTML = averages[x];
			value.className = "valTd";
			
			let compVal = document.createElement("td");
			
			compVal.innerHTML = data[masterFile ? mFileIndex : 0][x + 1];
			compVal.className = "valTd";
			
			exp.appendChild(div);
			tr.appendChild(exp);
			tr.appendChild(value);
			if(masterFile)tr.appendChild(compVal);
			table.appendChild(tr);
			x++;
		}
		document.getElementById("subBoard").appendChild(table);
	}
}

function changeTable(index){
	let tables = document.getElementsByClassName("tables");
	console.log(tables[index]);
	for(table of tables){
		table.style.display = "none";	
	}
	tables[index].style.display = "table";
	document.getElementById("dropdownButton").innerHTML = header[index];
}

function generateMenu(){
	let wrapper = document.getElementById("dropdownContent");
	document.getElementById("dropdownButton").innerHTML = header[0];
	for(let i = 0; i < content.length; i++){
		let a = document.createElement("a");
		a.href = "#";
		a.innerHTML = header[i];
		a.onclick = function(){
			changeTable(i);
		}
		wrapper.appendChild(a);
	}
}

function back(){
	window.open("index.html", "_self");
}

function exportData(){
	object = {
		prompt: "Please select the filetype:",
		btn0txt: "Export to PDF",
		btn1txt: "Export to JSON",
		btn0fct: function(){/*export2Word();*/document.getElementById("GFC").style.display = "none";},
		btn1fct: function(){
			let name = "AMM_DATA_" + getDate();
			downloadContent(name + ".json", JSON.stringify(data));
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

function backToMenu(){
		localStorage.setItem("sessionType", -1);
		window.open("../html/menu.html", "_self");
} 

function export2Word(){
	
}

function createPopup2(mFileIndex){
		object = {
			prompt: "WARNING LIMIT:",
			btn0txt: "-",
			btn1txt: "CONTINUE",
			btn0fct: function(){},
			btn1fct: function(){
				inf = document.getElementById("inputField");
				criticalDifference = inf.value;
				inf.remove();
				document.getElementById("GFC").style.display = "none";
				document.getElementById("GB0").style.display = "inline-block";
				generateTables(mFileIndex);
				generateMenu();
			}
		}
		document.getElementById("GB0").style.display = "none";
		let input = document.createElement("input");
		input.id = "inputField";
		input.type = "number";
		input.defaultValue = 1;
		input.min = 0.5;
		input.max = 4;
		input.step = 0.5;
		input.autofocus = true;
		
		document.getElementById("PUG").appendChild(input);
		loadPopup();
}