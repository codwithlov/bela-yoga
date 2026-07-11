
const rootLinks = document.querySelectorAll(".sgt-tab .sgt-tab-links");

// Use NodeList
rootLinks.forEach(tab => {
    tab.addEventListener("click", function (e) {
        const currentId = e.target.id.substring(1);
        const tabParent = tab.closest('.sgt-tab');
        const tabLinks = tabParent.getElementsByClassName('sgt-tab-links');
        const tabContent = tabParent.getElementsByClassName('sgt-tab-content');
        for (i = 0; i < tabContent.length; i++) {
            tabContent[i].style.display = "none";
        };
        for (i = 0; i < tabLinks.length; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(" active", "");
        }
        tabParent.querySelector('#' + currentId).style.display = "block";
        e.target.className += " active";
    })
});

// // Use HTMLCollection
// for (i = 0; i < tablinks.length; i++) {
//     tablinks[i].addEventListener("click", function (e) {
//         for (i = 0; i < tabcontent.length; i++) {
//             tabcontent[i].style.display = "none";
//         };
//         document.getElementById(`#${this.id}`).style.display = "block";
//         this.currentTarget.className += " active";
//     })
// }