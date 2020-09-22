let averages0 = []; //averages of file0
let averages1 = []; //averages of file1
let masterFile = false; //defines presence of mFile
window.onload = setup();


//parses data
function setup(){
	let data = JSON.parse(sessionStorage.getItem("compData"));
	let data0 = data[0];
	let data1 = data[1];
	console.log("Data @ eval.js ")
	console.log(data);
	let mFileIndex = findMasterFile(data0);
	for(let i = 1; i < data0[0].length; i++){
		let avg = 0;
		let nas = 0;
		 for(let j = 0; j < data0.length; j++){
			let val = parseInt(data0[j][i]);
			if(val == 6 || j == mFileIndex)nas++;
			else avg += val;
		}
		averages0.push((avg / (data0.length - nas)).toFixed(2));
		
	}
	console.log(averages0);
	masterFile = false;
	mFileIndex = findMasterFile(data1);
	for(let i = 1; i < data1[0].length; i++){
		let avg = 0;
		let nas = 0;
		 for(let j = 0; j < data1.length; j++){
			let val = parseInt(data1[j][i]);
			if(val == 6 || j == mFileIndex)nas++;
			else avg += val;
		}
		averages1.push((avg / (data1.length - nas)).toFixed(2));
		
	}
	console.log(averages1);	
	generateTables();
	
		
}


function findMasterFile(dataIntern){
	let index = -1;
	for(let i = 0; i < dataIntern.length; i++){
		if(dataIntern[i][0] == true){
			if(!masterFile){
				masterFile = true;
				index = i;
			}
			else throw "More than 1 master file";
		}
	}
	return index;
}

//generates all tables, turns inactive ones invisible
function generateTables(){
	let sb = document.getElementById("subBoard");
	let table0 = document.createElement("table");
	table0.id = "table0";
	let table1 = document.createElement("table");
	table0.id = "table1";
	
	let indHeader = document.createElement("td");
	indHeader.className = "indHeader";
	indHeader.innerHTML = "<div>INDICATOR</div>";
	table0.appendChild(indHeader);
	table1.appendChild(indHeader.cloneNode(true));
	
	let dataHeader0 = document.createElement("td");
	dataHeader0.className = "trendHeader";
	dataHeader0.innerHTML = "<div>Trend</div>";
	tippy(dataHeader0, {
		placement: "right-start",
		content: "Press to hide",
		duration: [100, 0],
		arrow: false,
		theme: "CoBa"
		});
	
	let dataHeader0_clone = dataHeader0.cloneNode(true);
	tippy(dataHeader0_clone, {
		placement: "right-start",
		content: "Press to hide",
		duration: [100, 0],
		arrow: false,
		theme: "CoBa"
		});
	
	dataHeader0.onclick = (ev) => {
		if(ev.button == 0){
			dataHeader0.style.display = "none";
			dataHeader0_clone.style.display = "none";
			for(let cell of document.getElementsByClassName("trendIcons")){
				cell.style.display = "none";
			}
		}
	}
	dataHeader0_clone.onclick = (ev) => {
		if(ev.button == 0){
			dataHeader0.style.display = "none";
			dataHeader0_clone.style.display = "none";
			for(let cell of document.getElementsByClassName("trendIcons")){
				cell.style.display = "none";
			}
		}
	}
	
	table0.appendChild(dataHeader0);
	table1.appendChild(dataHeader0_clone);
	
	let dataHeader1 = document.createElement("td");
	dataHeader1.className = "dataHeader";
	dataHeader1.innerHTML = "<div>File 1</div>";
	
	
	tippy(dataHeader1, {
		placement: "right-start",
		content: JSON.parse(sessionStorage.getItem("fileNames"))[0],
		duration: [100, 0],
		arrow: false,
		theme: "CoBa"
	});
	
	let dataHeader1_clone = dataHeader1.cloneNode(true);
	tippy(dataHeader1_clone, {
		placement: "right-start",
		content: JSON.parse(sessionStorage.getItem("fileNames"))[0],
		duration: [100, 0],
		arrow: false,
		theme: "CoBa"
	});
	
	table0.appendChild(dataHeader1);
	table1.appendChild(dataHeader1_clone);
	
	let dataHeader2 = document.createElement("td");
	dataHeader2.className = "dataHeader";
	dataHeader2.innerHTML = "<div>File 2</div>";

	tippy(dataHeader2, {
		placement: "right-start",
		content: JSON.parse(sessionStorage.getItem("fileNames"))[1],
		duration: [100, 0],
		arrow: false,
		theme: "CoBa"
	});
	
	let dataHeader2_clone = dataHeader2.cloneNode(true);
	tippy(dataHeader2_clone, {
		placement: "right-start",
		content: JSON.parse(sessionStorage.getItem("fileNames"))[1],
		duration: [100, 0],
		arrow: false,
		theme: "CoBa"
	});
	
	table0.appendChild(dataHeader2);
	table1.appendChild(dataHeader2_clone);
	
	let inc = 0;
	for(let i = 0; i < content.length; i++){
		for(let j = 0; j < content[i].length; j++){
			let tr = document.createElement("tr");
			tr.style.background = inc % 2 == 0 ? "white" : "#e6e6e6";
			
			let ind = document.createElement("td");
			ind.className = "ind";
			
			let div = document.createElement("div");
			div.innerHTML = content[i][j];
			div.className = "indInner";
			
			let growthCell = document.createElement("td");
			growthCell.className = "trendIcons";
			let giContainer = document.createElement("div");
			giContainer.style.width = "40%";
			giContainer.style.marginLeft = "30%";
			//giContainer.style.height = (window.innerHeight / 56.46) + "px";
			
			
			if(averages0[inc] > averages1[inc]) giContainer.innerHTML = "<svg viewBox=\"0 0 40 40\"><polygon points=\"10,17 30,17 20,27\" style=\"fill:red;stroke:black;stroke-width:1\"/></svg>";
			else if(averages0[inc] < averages1[inc]) giContainer.innerHTML = "<svg viewBox=\"0 0 40 40\"><polygon points=\"10,25 30,25 20,15\" style=\"fill:lime;stroke:black;stroke-width:1\"/></svg>";
			else giContainer.innerHTML = "<svg viewBox=\"0 0 40 40\"><polygon points=\"13,18 13,22 27,22 27,18\" style=\"fill:red;stroke:black;stroke-width:1\"/></svg>";
		
			growthCell.appendChild(giContainer);
			
			let data0 = document.createElement("td");
			data0.className = "data";
			data0.innerHTML = averages0[inc];
			let data1 = document.createElement("td");
			data1.className = "data";
			data1.innerHTML = averages1[inc];
			
			ind.appendChild(div);
			
			tr.appendChild(ind);
			tr.appendChild(growthCell);
			tr.appendChild(data0);
			tr.appendChild(data1);
			
			if(inc < contentLength() / 2 + 1)table0.appendChild(tr);
			else table1.appendChild(tr);
			inc++;
		}
	}
	sb.appendChild(table0);
	
	let backBtn = document.createElement("button");
	backBtn.id = "backBtn";
	backBtn.innerHTML = "BACK TO MENU";
	backBtn.onclick = function() {
		window.open("../html/menu.html", "_self");
	};
	
	sb.appendChild(table1);
	sb.appendChild(backBtn);
}