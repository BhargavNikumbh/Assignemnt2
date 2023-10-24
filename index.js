let data;

let leadershipPostList=[];
let leadershipPostNameList=[];
let leadershipPartyList=[];
let democratsList=[];
let republicansList=[];                      

async function fetchData(){
    try{
        const url = "senators.json";
        const promise = await fetch(url);
        data = await promise.json(); 
        displayData(data);  
    }catch(error){
        console.log(error);
    }
}

fetchData();

async function displayData(data){

    //counters
    let ctsenator=0;
    let ctreplub = 0;
    let ctdemo=0;

    let senatorArray = data.objects;
    let senatorConatiner="";
    let leadershipList="";
    
    ctsenator = senatorArray.length;
    for(let obj of senatorArray){
        
        let senatorCongressNumber = obj.congress_numbers;
        let senatorCurrent = obj.current;
        let senatorName = obj.person.firstname;
        let senatorGender = obj.person.gender;
        let senatorDesc = obj.description;
        let senatorEndDate = obj.enddate;
        let senatorAddress = obj.extra.address;
        let senatorContactForm = obj.extra.contact_form;
        let senatorFax = obj.extra.fax;
        let senatorOffice = obj.extra.office;
        let senatorLeaderShipTitle = obj.leadership_title;
        let senatorParty = obj.party;
        let senatorPerson = obj.person;
        let senatorPhone = obj.phone;
        let senatorRole = obj.role_type;
        let senatorRoleTypeLabel = obj.role_type_label;
        let senatorClass = obj.senator_class;
        let senatorClassLabel = obj.senator_class_label;
        let senatorRank = obj.senator_rank;
        let senatorRankLabel = obj.senator_rank_label;
        let senatorStartDate = obj.startdate;
        let senatorState = obj.state;
        let senatorTitle = obj.title;
        let senatorTitleLong = obj.title_long;
        let senatorWebsite = obj.website;

        if(obj.party==="Republican"){
            ctreplub++;
            republicansList.push(obj);
        }
        else if(obj.party==="Democrat"){
            ctdemo++;
            democratsList.push(obj);
        }

        if(senatorLeaderShipTitle!=null){
            leadershipPostList.push(senatorLeaderShipTitle);
            leadershipPostNameList.push(senatorName+" "+senatorPerson.lastname);
            leadershipPartyList.push(senatorParty);
        }
        senatorConatiner+=
                        `<div class="senator_container">
                            <button type="button" class="collapsible" onclick="manageCollapsableContent()">
                                <h3>${senatorName+" "+senatorPerson.lastname}</h3>
                                <b>Party: &nbsp;</b>${senatorParty}
                                <b>State: &nbsp;</b> ${senatorState}
                                <b>Gender: &nbsp;</b> ${senatorGender}
                                <b>Rank: &nbsp;</b> ${senatorRank}
                            </button>
                            <div class="content">
                            <b><p>Office: &nbsp;</p></b>${senatorOffice}
                                
                                <b><p>Date of Birth: &nbsp;</p></b> ${senatorPerson.birthday}
                                <b><p>Start Date: &nbsp;</p></b> ${senatorStartDate}
                                <b><p>Twitter: &nbsp;</p></b> <a href="${senatorPerson.twitterid}">${senatorPerson.twitterid}</a>
                                <b><p>YouTube Handle: &nbsp;</p></b> <a href="${senatorPerson.youtubeid}">${senatorPerson.youtubeid}</a>
                                <b><p>Senator Website: &nbsp;</p></b> <a href="${senatorWebsite}" target="_blank">${senatorWebsite}</a>
                            </div>
                        </div>`;
    }

    for(let i=0; i<leadershipPostList.length;i++){
        leadershipList+=`<div>
                            <p>${leadershipPostList[i]}: ${leadershipPostNameList[i]} (${leadershipPartyList[i]})</p>
                        </div>`;
    }

    let overAllCount = `<navbar>
                            <ul>
                                <li>Total Senators &nbsp; ${ctsenator}</li>
                                <li>Total Republicans &nbsp; ${ctreplub}</li>
                                <li>Total Democrats &nbsp;${ctdemo}</li>
                            </ul>
                        </navbar>`;
    
    document.getElementById("102").innerHTML = overAllCount;
    document.getElementById("103").innerHTML = senatorConatiner;
    document.getElementById("101").innerHTML = leadershipList;
}

const displayRepublicans =()=>{
    document.getElementById("103").innerHTML="";
    let replicanContainer=""
    for(let republican of republicansList){
        replicanContainer += `
                        <div class="senator_container">
                            <button type="button" class="collapsible" onclick="manageCollapsableContent()">
                                <h3>${republican.person.firstname} ${republican.person.lastname}</h3>
                                <b>Party: &nbsp;</b>${republican.party}
                                <b>State: &nbsp;</b> ${republican.state}
                                <b>Gender: &nbsp;</b> ${republican.person.gender}
                                <b>Rank: &nbsp;</b> ${republican.senator_rank_label}
                            </button>
                            <div class="content">
                            <b><p>Office: &nbsp;</p>${republican.extra.office}</b>
                                
                                <b><p>Date of Birth: &nbsp;</p>${republican.person.birthday}</b>
                                <b><p>Start Date: &nbsp;</p>${republican.startdate}</b>
                                <b><p>Twitter: &nbsp;</p></b> <a href="${republican.person.twitterid}">${republican.person.twitterid}</a>
                                <b><p>YouTube Handle: &nbsp;</p></b><a href="${republican.person.website}">${republican.person.website}</a>
                                <b><p>Senator Website: &nbsp;</p></b><a href="${republican.website}" target="_blank">${republican.website}</a>
                            </div>
                        </div>`
                    console.log(republican);
    }
    document.getElementById("104").innerHTML = replicanContainer;
}
const displayDemocrats = ()=>{
    document.getElementById("103").innerHTML="";
    let democratContainer=""
    for(let republican of democratsList){
        democratContainer += `
                        <div class="senator_container">
                            <button type="button" class="collapsible" onclick="manageCollapsableContent()">
                                <h3>${republican.person.firstname} ${republican.person.lastname}</h3>
                                <b>Party: &nbsp;</b>${republican.party}
                                <b>State: &nbsp;</b> ${republican.state}
                                <b>Gender: &nbsp;</b> ${republican.person.gender}
                                <b>Rank: &nbsp;</b> ${republican.senator_rank_label}
                            </button>
                            <div class="content">
                            <b><p>Office: &nbsp;</p>${republican.extra.office}</b>
                                
                                <b><p>Date of Birth: &nbsp;</p>${republican.person.birthday}</b>
                                <b><p>Start Date: &nbsp;</p>${republican.startdate}</b>
                                <b><p>Twitter: &nbsp;</p></b> <a href="${republican.person.twitterid}">${republican.person.twitterid}</a>
                                <b><p>YouTube Handle: &nbsp;</p></b><a href="${republican.person.website}">${republican.person.website}</a>
                                <b><p>Senator Website: &nbsp;</p></b><a href="${republican.website}" target="_blank">${republican.website}</a>
                            </div>
                        </div>`
                    console.log(republican);
    }
    document.getElementById("104").innerHTML = democratContainer;
}