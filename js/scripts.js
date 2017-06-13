document.addEventListener("DOMContentLoaded", function() {
    var searchField = document.getElementById('search-text');
    var newContactBtn = document.querySelector('.new-contact');
    var overlay = document.getElementById('overlay');
    var closeModalBtn = document.getElementById('modal_close');
    var contactModal = document.getElementById('contact-modal');
    var modalTab = document.querySelector(".modal-tab");
    updateFriendsCounter();

    searchField.onkeyup =function () {
        var contacts = document.getElementById('contacts');
        var searchTerm = searchField.value;
        var listItem = contacts.querySelectorAll(".list-group-item");
        var searchSplit = searchTerm.replace(/\+/g, "");
        searchSplit = searchSplit.replace(/ /g, "");
        listItem.forEach(function (element, index, array) {
            var regExp = new RegExp(searchSplit, 'i');
            elementItem = element.textContent.replace(/\n/g, "");
            if (elementItem.replace(/ /g, "").search(regExp) != -1){
                element.classList.add("visible");
                element.classList.remove("hidden");
            }else{
                element.classList.add("hidden");
                element.classList.remove("visible");
            }
        });
        updateFriendsCounter();
    };

    function updateFriendsCounter(){
        var visibleContacts = document.getElementsByClassName('visible').length;
        var friendsCounter = document.querySelector(".list-count");
        if (visibleContacts == 1){
            contacts.classList.remove('empty');
            friendsCounter.innerText = visibleContacts + ' friend';
        }
        else if(visibleContacts == 0){
            // shows empty state text when no contacts found
            contacts.classList.add('empty');
            friendsCounter.innerText = "";
        }
        else {
            contacts.classList.remove('empty');
            friendsCounter.innerText = visibleContacts + ' friends';
        }
    }
    newContactBtn.onclick = function (event) {
        modalTab.classList.add("fade-in");
    };
    document.onkeydown = function (event) {
        if (event.keyCode == 27){
            modalTab.classList.remove("fade-in");
        }
    };

    modalTab.onclick = function (event) {
        if (event.target == overlay || event.target == closeModalBtn )
        modalTab.classList.remove("fade-in");
    };

});
