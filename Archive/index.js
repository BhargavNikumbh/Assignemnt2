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
let leaderObj=[];

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
      leaderObj.push(obj);
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

// Taken From Google Charts to display Pie-Chart For the senators
const showchart = () => {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ["Party", "Total Number of Senators"],
      ["Republicans", ctreplub],
      ["Democrats", ctdemo],
      ["Independent", ctreplub - ctdemo],
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
  let leadershipList = `<div class="leader">
                            <b>Leadership List</b>
                        `;
  let demoLeaderList=[];
  for(let obj of leaderObj){
    if(obj.party == 'Republican'){
      leadershipList += `
                          <p>${obj.leadership_title} : ${obj.person.firstname} ${obj.person.lastname}(${obj.party})</p>
                      `;
    }else{
      demoLeaderList.push(obj);
    }
  }
  for (let obj of demoLeaderList) {
    leadershipList += `
                          <p> ${obj.leadership_title} : ${obj.person.firstname} ${obj.person.lastname}(${obj.party})</p>
                      `;
  }
  leadershipList+=`</div>`;
  document.getElementById("app-root").innerHTML = leadershipList;
}

// To fix filter browser issue: Use onChange for 'select' instead of onClick 
// (because onClick doesn't support event for 'option')

function handleChangeSenators(e) {
  let name = e.target.name
  let value = e.target.value
  if (value === 'all') {
    displaySenatorPage()
  } else {
    switch (name) {
      case 'senators':
        setFilterMap(value, null, null)
        break
      case 'rank_senators':
        setFilterMap(null, value, null)
        break
      case 'state_senators':
        setFilterMap(null, null, value)
        break
    }
  }

}

async function displaySenatorPage() {
  let republicanArray = [];
  let demoArray = [];
  let senatorArray;
  let senator = data.objects;
  let senatorConatiner = "";
  filterct=0;

  for(let obj of senator){
    if(obj.party=='Republican'){
      republicanArray.push(obj);
    }else{
      demoArray.push(obj);
    }
  }

  senatorArray = republicanArray.concat(demoArray);

  stateSet.forEach((value)=>{
    optionState+=`<option value="${value}" id="${value}" name="${value}">${value}</option> `
  });

  filter_dropdown = `<div>
                        <label>Order Senators by Party:</label>
                        <select name="senators" id="senators" onchange="handleChangeSenators(event)">
                                <option value="all">Show All</option>
                                <option value="Republican" id="republican" name="republican">Republican</option>
                                <option value="Democrat" id="democrat" name="democrat">Democrat</option>
                                <option value="Independent" id="Independent" name="Independent">Independent</option>
                        </select>
                        <label>Order Senators by Rank:</label>
                        <select name="rank_senators" id="rank_senators" onchange="handleChangeSenators(event)">
                                <option value="all">Show All</option>
                                <option value="Senior" id="rankSenior" name="senior">Senior</option>
                                <option value="Junior" id="rankJunior" name="junior">Junior</option>
                        </select>
                        <label>Order Senators by State:</label>
                        <select name="state_senators" id="state_senators" onchange="handleChangeSenators(event)">
                        <option>See All</option>`;
  filter_dropdown+=optionState;
  filter_dropdown+=`
                </select>
                <!-- <button id="searchButton">Search 2</button> -->
                <button onclick="displayFilteredSenatorPage()">Search</button>
                <button onclick="displaySenatorPage()">See All</button>
              </div>
              <p style="font-size: large;">Double click to expand and collapse options</p>`;
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

  // let searchButton = document.getElementById("searchButton");
  // searchButton.addEventListener("click", displayFilteredSenatorPage) 
  // for demo purpose
}

async function displayFilteredSenatorPage(){
  let senatorArray = data.objects;
  let republicanArray=[];
  let demoArray=[];
  let displayArray=[];
  let senatorConatiner="";
  senatorConatiner += filter_dropdown;
  if(filterMap.get("party")==null && filterMap.get("state")==null && filterMap.get("rank")==null){
    displaySenatorPage();
  }
  // for(let obj of senatorArray){
  //   if(filterMap.get("party")==obj.party && filterMap.get("state")==obj.state && filterMap.get("rank")==obj.senator_rank_label){
  //     displayArray.push(obj);
  //   }else if(filterMap.get("party")==obj.party && filterMap.get("state")==null && filterMap.get("rank")==null){
  //     displayArray.push(obj);
  //   }else if(filterMap.get("party")==null && filterMap.get("state")==obj.state && filterMap.get("rank")==null){
  //     displayArray.push(obj);
  //   }else if(filterMap.get("party")==null && filterMap.get("state")==null && filterMap.get("rank")==obj.senator_rank_label){
  //     displayArray.push(obj);
  //   }else if(filterMap.get("party")==obj.party && filterMap.get("state")==obj.state && filterMap.get("rank")==null){
  //     displayArray.push(obj);
  //   }else if(filterMap.get("party")==obj.party && filterMap.get("state")==null && filterMap.get("rank")==obj.senator_rank_label){
  //     displayArray.push(obj);
  //   }else if(filterMap.get("party")==null && filterMap.get("state")==obj.state && filterMap.get("rank")==obj.senator_rank_label){
  //     displayArray.push(obj);
  //   }
  // }
  senatorArray.map((obj)=>{
    if(filterMap.get("party")==obj.party && filterMap.get("state")==obj.state && filterMap.get("rank")==obj.senator_rank_label){
      displayArray.push(obj);
    }else if(filterMap.get("party")==obj.party && filterMap.get("state")==null && filterMap.get("rank")==null){
      displayArray.push(obj);
    }else if(filterMap.get("party")==null && filterMap.get("state")==obj.state && filterMap.get("rank")==null){
      displayArray.push(obj);
    }else if(filterMap.get("party")==null && filterMap.get("state")==null && filterMap.get("rank")==obj.senator_rank_label){
      displayArray.push(obj);
    }else if(filterMap.get("party")==obj.party && filterMap.get("state")==obj.state && filterMap.get("rank")==null){
      displayArray.push(obj);
    }else if(filterMap.get("party")==obj.party && filterMap.get("state")==null && filterMap.get("rank")==obj.senator_rank_label){
      displayArray.push(obj);
    }else if(filterMap.get("party")==null && filterMap.get("state")==obj.state && filterMap.get("rank")==obj.senator_rank_label){
      displayArray.push(obj);
    }
  })

  for(let obj of displayArray){
    if(obj.party=='Republican'){
      republicanArray.push(obj);
    }else{
      demoArray.push(obj);
    }
  }
  
  displayArray = republicanArray.concat(demoArray);

  for (let obj of displayArray) {
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
  document.getElementById("app-root").innerHTML = senatorConatiner;
  filterMap.set("party",null);
  filterMap.set("rank",null);
  filterMap.set("state",null);
}