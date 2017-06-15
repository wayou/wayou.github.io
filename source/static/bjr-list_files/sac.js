


 
function chg(id_num){ 

var oa = document.getElementById(id_num); 
var ob = document.getElementById("up"); 
var oc = document.getElementById("updown"); 

if(oa.style.display == "block"){ 

oa.style.display = "none"; 
oc.style.display = "block"; 
oc.style.display = "block"; 

}else{ 

oa.style.display = "block"; 
ob.style.display = "block"; 
oc.style.display = "none"; 

} 

return false; 

} 

 

 
function setTab(m,n){
var tli=document.getElementById("menu"+m).getElementsByTagName("li");
var mli=document.getElementById("main"+m).getElementsByTagName("ul");
for(i=0;i<tli.length;i++){
   tli[i].className=i==n?"hover":"";
   mli[i].style.display=i==n?"block":"none";
}
}

function changecss(){
var scr=(window.screen.width);
if(scr<=1024){ 
document.write("<link href='../images/top1024.css' rel='stylesheet' type='text\/css'\/>"); 
}else { 
document.write("<link href='../images/top.css' rel='stylesheet' type='text\/css'\/>"); 
} 
}

 function scro()
{
var s = window.screen.width;
var ind = document.getElementById("index");
if(s<=1152 && ind!=undefined && ind!=null){
		ind.style.width = 1050;	
}else if(ind!=undefined && ind!=null){
		ind.style.width = "100%";	
	}
}