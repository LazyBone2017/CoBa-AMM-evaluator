var sessionType = 0;

//0 -> manual data input
//1 -> personal files input
//2 -> master/personal file creation

var content = [
		["customer/users and their needs are known", "There is a pioneering vision with a customer-oriented approach", "customer/users involvement already in the generation of ideas", "Reviews & refinements take place with customer/users participation", "Various formats for obtaining customer/users feedback are used", "existing products are regularly checked for customer/users benefits"],
		["Prioritized backlogs are available", "Backlogs contain development/operations/transformation topics", "Agree quarterly planning with customer/users", "Executive Board participates in quarterly planning", "Impediments and risks are transparent", "Impediments and risks are solved or actively managed", "Transparency about existing and required skills", "Scarce resources are working on the prioritized topics", "Systematic know-how transfer takes place", "Agile meetings are well established", "Metrics are collected and visible to all team members"],
		["Employees see I&I as an integral part of their work", "There are scope and resources for I&I", "I&I topics are prioritized in the backlogs", "Successes achieved are celebrated/fail is addressed", "Metrics are used for planning and control", "Metrics are used for continuous improvement"],
		["Teams regularly produce value-added and value-added deliveries", "Incremental deliveries of MVPs enable early customer/users feedback", "Velocity in the teams makes delivery dates predictable", "E2E cut allows teams independent delivery capability", "Operation is efficient and stable", "Cross-functional teams with task-related skill mix", "Definition of Ready, Definition of Done/Acceptance criteria are clear, coordinated and transparent", "QBR-Epics, Epics, User Stories follow the INVEST principle and provide &quotfinished&quot functionality"],
		["Digital architects are actively involved in the software development process", "SW architecture model supports agile development", "Deployment is automated on the various instances (Dev, Test, prod, ...)", "Automated tests replace manual test whenever possible", "Automated, continuous software build"]		
];	

var header = ["CUSTOMER/USERS", "TRANSPARENCY", "IMPROVEMENT & INNOVATION", "DELIVERY CAPABILITY", "SOFTWARE DEVELOPMENT"];

//popups
var object = {prompt: "PROMPT", btn0txt: "btn0txt", btn1txt: "btn1txt", btn0Fct: -1, btn1Fct: -1};
object.seal;

window.onload = createPopupFramework();

function loadPopup(){
	let container = document.getElementById("GFC");
	/*document.body.addEventListener("keypress", (x) => {
		console.log(x.key);
        	//if(x.key === "Escape")console.log("YE");
    	});*/
	document.getElementById("PUTG").innerHTML = object.prompt;

	let btn0 = document.getElementById("GB0");
	btn0.innerHTML = object.btn0txt;
	btn0.onclick = object.btn0fct;
	
	let btn1 = document.getElementById("GB1");
	btn1.innerHTML = object.btn1txt;
	btn1.onclick = object.btn1fct;

	container.style.display = "block";
}

//structure
//let object = {prompt: "PROMPT", btn0txt: "Test", btn1txt: "Test2", btn0Fct: test(), btn1Fct: test1()};

function createPopupFramework(){
	let html = "<div id=\"GFC\" style=\"display: none\"><div id=\"PUG\"><p id=\"PUTG\"></p><button type=\"button\" id=\"GB0\"></button><button type=\"button\" id=\"GB1\"></button></div></div>";
	document.body.insertAdjacentHTML("beforeend", html);
	let link = document.createElement("link");
	link.href = "util.css";
	link.rel = "stylesheet";
	document.getElementsByTagName("head")[0].appendChild(link);
}