"use strict"
let mobile = window.matchMedia("(max-width: 665px)");
let breakpoint = window.matchMedia("(min-width: 666px)");
let inMobilePage = false;
let inDesktopPage = false;

/*THIS FUNCTION FIXES THE RESIZE PROBLEM WHEN RESIZING TO BREAKPOINT*/

function refresh() {
    if (mobile.matches && inDesktopPage || breakpoint.matches && inMobilePage) {
        location.reload()
    }
}

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
        document.querySelector(".worksTriangle h2").classList.toggle("fontColorSwitch");
        if (mobile.matches) {
            document.querySelector(".contactTriangle h2:nth-child(2)").classList.toggle("dontDisplay");
            document.querySelector(".contactTriangle h2").classList.toggle("dontDisplay");
            navContact.classList.toggle("homeTriangle");
            inMobilePage = true;
        } else if (breakpoint.matches) {
            document.querySelector(".contactTriangle").classList.toggle("inContact");
            document.querySelector(".contactTriangle h2").classList.toggle("fontColorSwitch");
            document.querySelector(".contactTriangle h2:nth-child(2)").classList.toggle("dontDisplay");
            document.querySelector(".contactTriangle h2").classList.toggle("dontDisplay");
            inDesktopPage = true;
        }
        window.addEventListener('resize', refresh)

    }
}



/*WORKS SCRIPT*/

let urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get("id");


if (window.location.pathname.includes("works")) {
    let navFilter = document.querySelector(".filterTriangle");
    let worksSection = document.querySelector(".worksContent");
    let page = 1;
    let worksPages = 0;
    let plusButton = document.querySelector("#plusButton");
    let template = document.querySelector("#worksTemp").content;
    let catid = urlParams.get("category");
    document.querySelector(".homeTriangle").addEventListener('click', function () {
        window.location = "index.html";
    })

    function fetchWorks() {

        let endpoint = "https://rtsdr.com/kea/07/wp01/wp-json/wp/v2/portfolio_works?_embed&order=asc&per_page=4&page=" + page
        if (catid) {
            endpoint = "https://rtsdr.com/kea/07/wp01/wp-json/wp/v2/portfolio_works?_embed&order=asc&per_page=4&page=" + page + "&categories=" + catid
        }

        fetch(endpoint)
            .then(e => {
                document.querySelector("#loaderSVG").classList.toggle("dontDisplay");
                document.querySelector(".worksContent").classList.toggle("invisible");
                worksPages = e.headers.get("X-WP-TotalPages")
                return e.json()
            })

            .then(showWorks)
    }


    /*plusButton.addEventListener('click', function () {
        if (page < worksPages) {
            page++;
            fetchWorks();
        } else if (page >= worksPages) {
            plusButton.classList.add("dontDisplay");
        }
    })
*/
    function showWorks(data) {
        data.forEach(showSingleWork);

    }


    function showSingleWork(aWork) {

        let clone = template.cloneNode(true);
        let cloneImg = clone.querySelector(".worksImg");
        clone.querySelector(".workTitle").innerHTML = aWork.title.rendered
        clone.querySelector(".worksImg").alt = aWork.acf.image.alt
        if (mobile.matches) {
            inMobilePage = true;
            cloneImg.src = aWork.acf.image.sizes.medium
        }
        if (breakpoint.matches) {
            inDesktopPage = true;
            cloneImg.src = aWork.acf.image.sizes.medium_large
        }

        let downloadingImage = new Image();
        downloadingImage.src = cloneImg.src;

        function showSubpage() {
            window.location.href = "project.html?id=" + aWork.id;
        }
        clone.querySelector(".singleWork").addEventListener('click', showSubpage)
        /*this function is here to delay the individual items showing until the src file was fetched*/
        downloadingImage.onload = function () {
            worksSection.appendChild(clone);
        }
        if (page >= worksPages) {
            plusButton.classList.add("dontDisplay");
        }
        if (page < worksPages) {
            plusButton.classList.remove("dontDisplay");
            plusButton.addEventListener('click', function () {
                page++;
                fetchWorks();
            })
        }
        window.addEventListener('resize', refresh)
    }

    /*BUILD MENU*/

    fetch("https://rtsdr.com/kea/07/wp01/wp-json/wp/v2/categories?_embed&parent=54")
        .then(e => e.json())
        .then(buildMenu)

    function buildMenu(data) {
        let filterOption = document.querySelector("#currentOpt");
        filterOption.classList.toggle("invisible");

        data.forEach(item => {
            let currentOption = new URLSearchParams(window.location.search)
            let curCat = currentOption.get("category");
            if (mobile.matches) {
                inMobilePage = true;
            }
            let header = document.createElement("h2");
            let option = document.createElement("h1");
            header.textContent = item.name;
            navFilter.appendChild(header);
            header.classList.toggle("dontDisplay");
            /*Desktop Filter*/
            if (breakpoint.matches) {
                document.querySelector(".desktopAll").addEventListener('click', function () {
                    window.location.href = "works.html";
                })
                inDesktopPage = true;
                if (curCat == item.id) {
                    header.classList.toggle("choice")
                }
                filterOption.classList.toggle("dontDisplay")
                header.classList.toggle("dontDisplay");
                header.classList.add("desktopFilter");
                document.querySelector("#desktopFilterSec").appendChild(header);
                document.querySelector("#desktopFilterSec").classList.toggle("invisible")
            }
            window.addEventListener('resize', refresh)
            header.addEventListener('click', function () {
                window.location.href = "works.html?category=" + item.id;
            })
            if (window.location.href.includes("category")) {
                document.querySelector(".desktopAll").classList.toggle("choice")
            }
            /*SHOW CURRENT FILTER OPTION*/


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

       fetchWorks();
    document.querySelector(".worksContent").classList.toggle("invisible");
    document.querySelector("#loaderSVG").classList.toggle("dontDisplay");

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

    let endpoint = "https://rtsdr.com/kea/07/wp01/wp-json/wp/v2/portfolio_works/" + id

    fetch(endpoint)
        .then(e => e.json())
        .then(showSingleWork);

    function showSingleWork(aProject) {

        let clone = subTemplate.cloneNode(true);
        let projectExplanation = aProject.acf.info_how;
        clone.querySelector("#subpageImg").src = aProject.acf.image.sizes.large;
        clone.querySelector("#subpageImg").alt = aProject.acf.image.alt;
        clone.querySelector("#subpageTitle").innerHTML = aProject.title.rendered;
        clone.querySelector("#description").textContent = aProject.acf.description;
        clone.querySelector("#explanation").innerHTML = aProject.acf.info_how;
        if (aProject.acf.link) {
            function goToProject() {
                window.open(aProject.acf.link, '_blank')
            }
            clone.querySelector("#visitLink").classList.toggle("dontDisplay")
            clone.querySelector("#visitLink").addEventListener('click', goToProject)
            clone.querySelector("#subpageImg").addEventListener('click', goToProject)
        }
        if (aProject.acf.file) {
            clone.querySelector("#downloadLink").href = aProject.acf.file.url
            clone.querySelector("#downloadLink").classList.toggle("dontDisplay")
        }
        document.querySelector("#loaderSVG").classList.toggle("dontDisplay");
        subpage.appendChild(clone)

    }

}
