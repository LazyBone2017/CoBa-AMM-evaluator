let averages = [];
let data;
window.onload = setup();

function setup(){
	data = JSON.parse(localStorage.getItem("data"));
	console.log(data);
	for(let i = 0; i < data[0].length; i++){
		let avg = 0;
		let nas = 0;
		 for(let j = 0; j < data.length; j++){
			let val = parseInt(data[j][i]);
			if(val == 6)nas++;
			else avg += val;
			//avg += val == 6 ? 0 : val;
		}
		averages.push((avg / (data.length - nas)).toFixed(2));
		
	}
	console.log(averages);
	generateTables();
	generateMenu();
	/*html2pdf()
	.set({ html2canvas: { scale: 4 } })
    .from(document.body)
    .save();*/
		
}

function generateTables(){
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
		
		tr.appendChild(td0);
		tr.appendChild(td1);
		table.appendChild(tr);
		
		
		for(let j = 0; j < content[i].length; j++){
			let tr = document.createElement("tr");
			if(j %  2 == 1)tr.style.background = "#e6e6e6";
			
			let exp = document.createElement("td");
			exp.className = "expTd";

			let div = document.createElement("div");
			div.innerHTML = content[i][j];
			let value = document.createElement("td");
			value.innerHTML = averages[x];
			value.className = "valTd";
			exp.appendChild(div);
			tr.appendChild(exp);
			tr.appendChild(value);
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
		prompt: "Please select the filetype",
		btn0txt: "Export to PDF",
		btn1txt: "Export to JSON",
		btn0fct: function(){alert("PDF functionality hasn't been implemented yet.");document.getElementById("GFC").style.display = "none";},
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