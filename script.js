"use strict"
let navContact = document.querySelector(".contactTriangle");

navContact.addEventListener('click', GoToContact)

function GoToContact(){
    document.querySelector(".index").classList.toggle("inContactPage");
    document.querySelector("#indexContent").classList.toggle("dontDisplay");
    document.querySelector(".contactPage").classList.toggle("dontDisplay");
    document.querySelector(".contactTriangle h2:nth-child(2)").classList.toggle("dontDisplay");
    document.querySelector(".contactTriangle h2").classList.toggle("dontDisplay");
    navContact.classList.toggle("homeTriangle");
}
