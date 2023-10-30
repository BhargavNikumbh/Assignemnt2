let data;

let filterct = 0;
let ctsenator=0;
let ctreplub = 0;
let ctdemo = 0;

let leadershipPostList = [];
let leadershipPostNameList = [];
let leadershipPartyList = [];
let democratsList = [];
let republicansList = [];
let stateSet=new Set();
let optionState="";
let filter_dropdown;

// let senatorArray = data.objects;
let filteredArray= [];

let filterMap = new Map();
filterMap.set("party",null);
filterMap.set("rank",null);
filterMap.set("state",null);

async function fetchData() {
  try {
    const url = "senators.json";
    const promise = await fetch(url);
    data = await promise.json();
    prepareData(data);
    displayHomePage(data);
  } catch (error) {
    console.log(error);
  }
}

function prepareData(data) {
  //counters

  let senatorArray = data.objects;
  for (let obj of senatorArray) {
    if (obj.party === "Republican") {
      ctreplub++;
      republicansList.push(obj);
    } else if (obj.party === "Democrat") {
      ctdemo++;
      democratsList.push(obj);
    }

    stateSet.add(obj.state);

    if (obj.leadership_title != null) {
      leadershipPostList.push(obj.leadership_title);
      leadershipPostNameList.push(
        obj.person.firstname + " " + obj.person.lastname
      );
      leadershipPartyList.push(obj.party);
    }
    ctsenator++;
  }
  
}


fetchData();

async function setFilterMap(party ,rank, state){
  if(party!=null){
    filterMap.set("party",party);
  }
  if(rank !=null){
    filterMap.set("rank",rank);
  }
  if(state != null){
    filterMap.set("state",state);
  }
  displayFilteredSenatorPage();
}

async function displayHomePage() {
  showchart();
  let overAllCount = `               
                        <div id="piechart" 
                        style="width: 800px;
                         height: 500px;
                         border: 1px dotted grey;
                         border-radius: 2px;
                         margin-left:30%;
                         opacity: 0.8;
                         animation-timing-function: ease-in-out;
                        "></div>                        
                        `;
  document.getElementById("app-root").innerHTML = overAllCount;
}

const showchart = () => {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ["Party", "Total Number of Senators"],
      ["Republicans", ctreplub],
      ["Democrats", ctdemo],
      ["Third Pary", ctreplub - ctdemo],
    ]);

    var options = {
      title: "Senator Splitup",
    };
    var chart = new google.visualization.PieChart(
      document.getElementById("piechart")
    );
    chart.draw(data, options);
  }
};

function displayLeaderPage() {
  let leadershipList = `<div>
                            <b>Leadership List</b>
                        </div>`;
  let demoLeaderList=[];
  let repubLeaderList=[];
  // for(let i=0;i<leadershipPostList.length;i++){
  //   if(leadershipPostList.leadershipPartyList)
  // }
  for (let i = 0; i < leadershipPostList.length; i++) {
    leadershipList += `<div class="leader">
                          <p>${leadershipPostList[i]}: ${leadershipPostNameList[i]} (${leadershipPartyList[i]})</p>
                      </div>`;
  }
  document.getElementById("app-root").innerHTML = leadershipList;
}

async function displaySenatorPage() {
  let senatorArray = data.objects;
  let senatorConatiner = "";
  filterct=0;

  stateSet.forEach((value)=>{
    optionState+=`<option onclick="setFilterMap(null,null, document.getElementById('${value}').value)" id="${value}" name="${value}">${value}</option> `
  });

  filter_dropdown = `<div>
                        <label>Order Senators by Party:</label>
                        <select name="senators" id="senators">
                                <option onclick="displaySenatorPage()">Show All</option>
                                <option onclick="setFilterMap(document.getElementById('republican').value,null,null)" id="republican" name="republican">Republican</option>
                                <option onclick="setFilterMap(document.getElementById('democrat').value,null,null)" id="democrat" name="democrat">Democrat</option>
                        </select>
                        <label>Order Senators by Rank:</label>
                        <select name="rank_senators" id="rank_senators">
                                <option onclick="displaySenatorPage()">Show All</option>
                                <option onclick="setFilterMap(null,document.getElementById('rankSenior').value,null)" id="rankSenior" name="senior">Senior</option>
                                <option onclick="setFilterMap(null,document.getElementById('rankJunior').value,null)" id="rankJunior" name="junior">Junior</option>
                        </select>
                        <label>Order Senators by State:</label>
                        <select name="state_senators" id="state_senators">
                        <option onclick="displaySenatorPage()">See All</option>`;
  filter_dropdown+=optionState;
  filter_dropdown+=`
                </select>
              </div>`;
  senatorConatiner += filter_dropdown; 

  for (let obj of senatorArray) {
    senatorConatiner += `<div class="senator_container" onclick="manageCollapsableContent()">
                            <button type="button" class="collapsible">
                                <h3>${
                                  obj.person.firstname +
                                  " " +
                                  obj.person.lastname
                                }</h3>
                                <b>Party: &nbsp;</b>${obj.party}
                                <b>State: &nbsp;</b> ${obj.state}
                                <b>Gender: &nbsp;</b> ${obj.person.gender}
                                <b>Rank: &nbsp;</b> ${obj.senator_rank_label}
                            </button>
                            <div class="content">
                            <b><p>Office: &nbsp;</p></b>${obj.extra.address}
                                
                                <b><p>Date of Birth: &nbsp;</p></b> ${
                                  obj.person.birthday
                                }
                                <b><p>Start Date: &nbsp;</p></b> ${
                                  obj.startdate
                                }
                                <b><p>Twitter: &nbsp;</p></b> <a href="${
                                  obj.person.twitterid
                                }">${obj.person.twitterid}</a>
                                <b><p>YouTube Handle: &nbsp;</p></b> <a href="${
                                  obj.person.youtubeid
                                }">${obj.person.youtubeid}</a>
                                <b><p>Senator Website: &nbsp;</p></b> <a href="${
                                  obj.website
                                }" target="_blank">${obj.website}</a>
                            </div>
                        </div>`;
  }
  document.getElementById("app-root").innerHTML = senatorConatiner;
}

async function displayFilteredSenatorPage() {
  let senatorArray1=[];
  let senatorConatiner = "";
  // let n=[];

  if(filterct==0){
    senatorArray1 = data.objects;
    filterct++;
  }else{
    for(let i=0;i<filteredArray.length;i++){
      senatorArray1.push(filteredArray[i]);
      // delete filteredArray[i];
    }
  }
  filteredArray=[];
  console.log("filtered Array"+filteredArray.length);

  senatorConatiner += filter_dropdown;

  for(let obj of senatorArray1){
      if(obj.party == filterMap.get("party")){
        filteredArray.push(obj); 
      }
      if(obj.senator_rank_label == filterMap.get("rank")){
        filteredArray.push(obj);
      }
      if(obj.state == filterMap.get("state")){
        filteredArray.push(obj);
      }
  }
  senatorConatiner+=`<h3>Showing results for:
                      <div style="display: flex;">
                      <p>Party: ${filterMap.get("party")}</p> &emsp;
                      <p>Rank: ${filterMap.get("rank")}</p> &emsp;
                      <p>State: ${filterMap.get("state")}</p> &nbsp;
                      </div></h3>`
  filterMap.set("party",null);
  filterMap.set("rank",null);
  filterMap.set("state",null);
  console.log("Senator Array"+senatorArray1.length);
  console.log("filtered Array after for loop"+filteredArray.length);
  if(filteredArray.length>0){
    for (let obj of filteredArray) {
      senatorConatiner += `   <div class="senator_container" onclick="manageCollapsableContent()">
                              <button type="button" class="collapsible">
                                  <h3>${
                                    obj.person.firstname +
                                    " " +
                                    obj.person.lastname
                                  }</h3>
                                  <b>Party: &nbsp;</b>${obj.party}
                                  <b>State: &nbsp;</b> ${obj.state}
                                  <b>Gender: &nbsp;</b> ${obj.person.gender}
                                  <b>Rank: &nbsp;</b> ${obj.senator_rank_label}
                              </button>
                              <div class="content">
                              <b><p>Office: &nbsp;</p></b>${obj.extra.address}
                                  
                                  <b><p>Date of Birth: &nbsp;</p></b> ${
                                    obj.person.birthday
                                  }
                                  <b><p>Start Date: &nbsp;</p></b> ${
                                    obj.startdate
                                  }
                                  <b><p>Twitter: &nbsp;</p></b> <a href="${
                                    obj.person.twitterid
                                  }">${obj.person.twitterid}</a>
                                  <b><p>YouTube Handle: &nbsp;</p></b> <a href="${
                                    obj.person.youtubeid
                                  }">${obj.person.youtubeid}</a>
                                  <b><p>Senator Website: &nbsp;</p></b> <a href="${
                                    obj.website
                                  }" target="_blank">${obj.website}</a>
                              </div>
                          </div>`;
    }
  }else{
    senatorConatiner+=`<h1>Sorry, No Senators Found</h1>`
    filteredArray=data.objects;
  }
  
  document.getElementById("app-root").innerHTML = senatorConatiner;
}