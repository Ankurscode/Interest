

function calculate(){
    const capital=parseInt(document.getElementById("capital").value)
const year=parseInt(document.getElementById("year").value)
const intrest=parseInt(document.getElementById("intrest").value)


    const result=capital*year*intrest/100;
    document.getElementById("result").innerHTML=parseInt(result);
}

