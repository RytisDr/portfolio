"use strict"

/*INDEX SCRIPT*/
if (window.location.pathname.includes("index")) {
    let navContact = document.querySelector(".contactTriangle");
    let navWorks = document.querySelector(".worksTriangle");
    navWorks.addEventListener('click', function () {
        /*DONT FORGET TO REMOVE .HTML WHEN UPLOADING*/
        window.location = 'works.html'
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

/*WORKS SCRIPT*/

let urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get("id");


if (window.location.pathname.includes("works")) {
    let navFilter = document.querySelector(".filterTriangle");
    let worksSection = document.querySelector(".worksContent");
    let page = 1;
    let template = document.querySelector("#worksTemp").content;
    let catid = urlParams.get("category");

    document.querySelector(".homeTriangle").addEventListener('click', function () {
        window.location = "index.html";
    })

    function fetchWorks() {
        let endpoint = "http://rtsdr.com/kea/07/wp01/wp-json/wp/v2/portfolio_works?_embed&order=asc&per_page=3&page=" + page
        if (catid) {
            endpoint = "http://rtsdr.com/kea/07/wp01/wp-json/wp/v2/portfolio_works?_embed&order=asc&per_page=3&page=" + page + "&categories=" + catid
        }
        fetch(endpoint)
            .then(e => {
                let worksPages = e.headers.get("X-WP-TotalPages")
                return e.json()
            })
            .then(showWorks)
    }

    function showWorks(data) {
        data.forEach(showSingleWork)
    }

    function showSingleWork(aWork) {

        let clone = template.cloneNode(true);
        clone.querySelector(".workTitle").textContent = aWork.title.rendered;

        clone.querySelector(".worksImg").src = aWork.acf.image.sizes.medium;
        clone.querySelector(".worksImg").alt = aWork.acf.image.alt;

        /* if (aWork.type.includes("_")) {
             category.textContent = category.textContent.replace("_", " ")
         }*/
        /*clone.querySelector(".singleEvent").addEventListener('click', showSubpage)

        function showSubpage() {
            window.location.href = "project.html?id=" + aWork.id;
        }*/
        worksSection.appendChild(clone);

    }
    fetchWorks();

    navFilter.addEventListener('click', function () {
        let navFilterH2 = document.querySelector(".filterTriangle h2");
        navFilterH2.classList.toggle("active");
        document.querySelector(".filterTriangle h2 span").classList.toggle("fullOpacity");
        /*document.querySelector(".homeTriangle").classList.toggle("dontDisplay");*/
        navFilter.classList.toggle("filterMenu");
       /* navFilterH2.classList.toggle("dontDisplay");*/

        /*navFilter.addEventListener('transitionend', function(){
            document.querySelector(".filterTriangle h2").classList.toggle("dontDisplay");
        });*/
    })
}
