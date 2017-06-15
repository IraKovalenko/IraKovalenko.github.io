document.addEventListener("DOMContentLoaded", function() {
    var searchField = document.getElementById('search-text');
    var overlay = document.getElementById('overlay');
    var listItem = document.querySelectorAll("#contacts .list-group-item");
    var contactModal = document.getElementById('contact-modal');
    var modalTab = document.querySelector(".modal-tab");
    var newContactBtn = document.querySelector('.new-contact');
    var clearAllBtn = document.querySelector('.clear');
    var numInput = document.querySelector(".phone");
    var email = document.querySelector(".email");
    var fbInput = document.querySelector(".fb");
    var twitterInput = document.querySelector(".twitter");
    var contactList = document.querySelector('.contact-list');
    updateFriendsCounter();
// document.onclick = function (e) {console.log(e.target);  };
// searching process
    searchField.onkeyup = function () {
        var searchTerm = searchField.value;
        var searchSplit = searchTerm.replace(/\+/g, "");
        searchSplit = searchSplit.replace(/ /g, "");
        listItem.forEach(function (element) {
            var regExp = new RegExp(searchSplit, 'i');
            var elementItem = element.textContent.replace(/\n/g, "");
            if (elementItem.replace(/ /g, "").search(regExp) !== -1) {
                element.classList.add("visible");
                element.classList.remove("hidden");
            } else {
                element.classList.add("hidden");
                element.classList.remove("visible");
            }
        });
        updateFriendsCounter();
    };
// end of searching process

// spellchecking of inputs in createNew modal tab
    numInput.onkeyup =function () {
        var re = /[^+?|\d\-() ]/;
        if (re.test(numInput.value)) {
            numInput.value = numInput.value.replace(re, '');
        }
    };
    email.addEventListener('input', isValid.bind(email, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));
    fbInput.addEventListener('input', isValid.bind(fbInput, /(?:http:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/));
    twitterInput.addEventListener('input', isValid.bind(twitterInput, /@([A-Za-z0-9_]{1,15})/i));
    function isValid(reg) {
        var valid = reg.test(this.value);
        if (!valid){
            this.classList.add("invalid");
        }
        else{
            this.classList.remove("invalid");
        }
    }
//end of spellchecking

// showing and hiding modal tab
    newContactBtn.onclick = function () {
        showTab.call(contactModal);
    };
    contactList.onclick = function (event) {
        // var remove = document.querySelector('.glyphicon-remove');
        // var edit = document.querySelector('.glyphicon-pencil');
        // var info = document.querySelector('.glyphicon-option-horizontal');
        // var contactName = document.querySelector('.contact-name');
        // var contactNumber = document.querySelector('.contact-number');
        var targ = event.target;
        if (targ.classList.contains('glyphicon-remove')){
            var removeModal = document.getElementById("remove-modal");
            showTab.call(removeModal);
        }
        if (targ.classList.contains('glyphicon-pencil')){
            var editModal = document.getElementById("edit-modal");
            showTab.call(editModal);
        }
        if(targ.classList.contains('visible')
            || targ.classList.contains('contact-name')
            || targ.classList.contains('glyphicon-option-horizontal')
            || targ.classList.contains('contact-number')){
            var infoModal = document.getElementById("info-modal");
            showTab.call(infoModal);
        }
    };
    document.onkeydown = function (event) {
        if (event.keyCode === 27) {
            hideTab();
        }
    };
    modalTab.onclick = function (event) {
        if (event.target === overlay || event.target === document.querySelector('.open .modal-close') ) {
            hideTab();
        }
    };
    function showTab() {
        modalTab.classList.add("fade-in");
        this.classList.add("open");
        event.stopPropagation();
    }
    function hideTab(){
        var tab = document.querySelector('.open');
        modalTab.classList.remove("fade-in");
        if (tab.getAttribute('data-mode') === "add") {
            tab.classList.remove("open");
            clearAll();
        }else{
            tab.classList.remove("open");
        }
    }
// end of showing and hiding modal tab
    clearAllBtn.onclick = clearAll;
    function clearAll() {
        [].slice.call(document.getElementsByClassName('i-group')[0].children).forEach(function (elem) {elem.value = null;});
    }
    function updateFriendsCounter(){
        var visibleContacts = document.getElementsByClassName('visible').length;
        var friendsCounter = document.querySelector(".list-count");
        if (visibleContacts === 1){
            contactList.classList.remove('empty');
            friendsCounter.innerText = visibleContacts + ' friend';
        }
        else if(visibleContacts === 0){
            // shows empty state text when no contacts found
            contactList.classList.add('empty');
            friendsCounter.innerText = "";
        }
        else {
            contactList.classList.remove('empty');
            friendsCounter.innerText = visibleContacts + ' friends';
        }
    }
});
