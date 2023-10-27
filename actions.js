//Managing collapsible buttons
function manageCollapsableContent(){
    let col1 = document.getElementsByClassName("collapsible");
    let i;
    for(i=0;i<col1.length;i++){
        col1[i].addEventListener("click",function(){
            this.classList.toggle("active");
            let content = this.nextElementSibling;
            if(content.style.maxHeight){
                content.style.maxHeight=null;
            }
            else{
                content.style.maxHeight = content.scrollHeight+"px";
            }
        });
    }
}