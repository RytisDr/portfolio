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
    document.querySelector("#loaderSVG").classList.toggle("dontDisplay");
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

        clone.querySelector(".singleWork").addEventListener('click', showSubpage)

        function showSubpage() {
            window.location.href = "project.html?id=" + aWork.id;
        }
        worksSection.appendChild(clone);
        document.querySelector("#loaderSVG").classList.toggle("dontDisplay");
    }
    fetchWorks();

    /*BUIL MENU*/

    fetch("http://rtsdr.com/kea/07/wp01/wp-json/wp/v2/categories?_embed&parent=54")
        .then(e => e.json())
        .then(buildMenu)

    function buildMenu(data) {
        let filterOption = document.querySelector("#currentOpt");
        filterOption.classList.toggle("invisible")
        data.forEach(item => {
            let header = document.createElement("h2");
            let option = document.createElement("h1");
            header.textContent = item.name;

            navFilter.appendChild(header);
            option.classList.add("dontDisplay");
            header.classList.add("dontDisplay");
            header.addEventListener('click', function () {
                window.location.href = "works.html?category=" + item.id;
            })
            /*SHOW CURRENT FILTER OPTION*/

            let currentOption = new URLSearchParams(window.location.search)
            let curCat = currentOption.get("category");
            if (curCat == item.id) {
                filterOption.textContent = item.name + " Projects";
            }

            navFilter.addEventListener('click', openMenu)

            function openMenu() {
                let navFilterH2 = document.querySelector(".filterTriangle h2");
                let backArrow = document.querySelector("#filterBack");
                header.classList.toggle("dontDisplay");
                document.querySelector("#filterAll").classList.toggle("dontDisplay");
                navFilterH2.classList.toggle("active");
                document.querySelector(".filterTriangle h2 span").classList.toggle("fullOpacity");
                navFilter.classList.toggle("filterMenu");
                backArrow.classList.toggle("dontDisplay");
                document.querySelector("#filterAll").addEventListener('click', function () {
                    window.location.href = "works.html";
                })

            }

        })

    }

}

/*SINGLE PROJECT SUBPAGE SCRIPT*/

if (window.location.pathname.includes("project")) {

    document.querySelector(".homeTriangle").addEventListener('click', function () {
        window.location = "index.html";
    })
    document.querySelector(".worksTriangle").addEventListener('click', function () {
        window.history.back();
    })
    document.querySelector("#loaderSVG").classList.toggle("dontDisplay");
    let subpage = document.querySelector("#singleProject")
    let subTemplate = document.querySelector("#subTemp").content

    let endpoint = "http://rtsdr.com/kea/07/wp01/wp-json/wp/v2/portfolio_works/" + id

    fetch(endpoint)
        .then(e => e.json())
        .then(showSingleWork);

    function showSingleWork(aProject) {

        let clone = subTemplate.cloneNode(true);
        clone.querySelector("#subpageImg").src = aProject.acf.image.sizes.medium_large
        clone.querySelector("#subpageImg").alt = aProject.acf.image.alt
        clone.querySelector("#subpageTitle").textContent = aProject.title.rendered
        clone.querySelector("#description").textContent = aProject.acf.full_description
        clone.querySelector("#explanation").textContent = aProject.acf.info_how
        if (aProject.acf.link) {
            clone.querySelector("#visitLink").classList.toggle("dontDisplay")
            clone.querySelector("#visitLink").href = aProject.acf.link
            clone.querySelector("#subpageImg").addEventListener('click', function (){
                window.open(aProject.acf.link, '_blank')
            })
        }
        if (aProject.acf.file) {

            clone.querySelector("#downloadLink").href = aProject.acf.file.url
             clone.querySelector("#downloadLink").classList.toggle("dontDisplay")
        }
        subpage.appendChild(clone)
        document.querySelector("#loaderSVG").classList.toggle("dontDisplay");
    }

}
