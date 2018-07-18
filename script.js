"use strict"

/*INDEX SCRIPT*/
if (window.location.pathname.includes("index")) {
    let navContact = document.querySelector(".contactTriangle");
    let navWorks = document.querySelector(".worksTriangle");
    navWorks.addEventListener('click', function(){
        /*DONT FORGET TO REMOVE .HTML WHEN UPLOADING*/
        window.location='works.html'
    })
    navContact.addEventListener('click', GoToContact);

    function GoToContact() {
        document.querySelector(".index").classList.toggle("inContactPage");
        document.querySelector(".indexContent").classList.toggle("dontDisplay");
        document.querySelector(".contactPage").classList.toggle("dontDisplay");
        document.querySelector(".contactTriangle h2:nth-child(2)").classList.toggle("dontDisplay");
        document.querySelector(".contactTriangle h2").classList.toggle("dontDisplay");
        navContact.classList.toggle("homeTriangle");
        document.querySelector(".worksTriangle h2").classList.toggle("fontColorSwitch");
    }
}

