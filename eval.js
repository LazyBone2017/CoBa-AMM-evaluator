let averages = [];
window.onload = setup();

function setup(){
	let data = JSON.parse(localStorage.getItem("data"));
	console.log(data);
	for(let i = 0; i < data[0].length; i++){
		let avg = 0;
		 for(let j = 0; j < data.length; j++){
			avg += parseInt(data[j][i]);
		}
		averages.push(avg / data.length);
	}
	console.log(averages);
	generateTables();
	generateMenu();
}

function generateTables(){
	let x = 0;
	for(let i = 0; i < content.length; i++){
		let table = document.createElement("table");
		table.id = "table" + i;
		table.className = "tables";
		if(i != 0)table.style.display = "none";
		for(let j = 0; j < content[i].length; j++){
			let tr = document.createElement("tr");
			
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