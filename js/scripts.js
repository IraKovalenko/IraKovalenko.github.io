document.addEventListener("DOMContentLoaded", function() {
    var emptyContact = document.getElementsByClassName("empty-contact")[0].children[0];
    var searchField = document.getElementById('search-text');
    var overlay = document.getElementById('overlay');
    var list = document.querySelector('.list-group');
    var listItem = list.querySelectorAll(".list-group-item");
    var contactModal = document.getElementById('contact-modal');
    var modalTab = document.querySelector(".modal-tab");
    var newContactBtn = document.querySelector('.new-contact');
    var clearAllBtn = document.querySelector('.clear');
    var nameInput = document.querySelector(".name");
    var numInput = document.querySelector(".phone");
    var emailInput = document.querySelector(".email");
    var facebookInput = document.querySelector(".facebook");
    // var skypeInput = document.querySelector(".skype");
    var twitterInput = document.querySelector(".twitter");
    // var commentInput = document.querySelector(".comment");
    var contactList = document.querySelector('.contact-list');
    var infoModal = document.getElementById("info-modal");
    var removeModal = document.getElementById("remove-modal");
    var editModal = document.getElementById("edit-modal");


    updateFriendsCounter();


    // searching process
    searchField.onkeyup = function () {
        var searchTerm = searchField.value;
        var searchSplit = searchTerm.replace(/\+/g, "").replace(/ /g, "");
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
    nameInput.addEventListener('input', function () {
        toggleInvalid.call(nameInput);
    });
    numInput.addEventListener('input', function () {
        var re = /[^+?|\d\-() ]/;
        if (re.test(numInput.value)) {
            numInput.value = numInput.value.replace(re, '');
        }
        toggleInvalid.call(numInput);

    });
    function toggleInvalid(){
        if (this.value !== '') {
            this.classList.remove("invalid");
        }
        else{
            this.classList.add("invalid");
        }
    }
    emailInput.addEventListener('input', isValid.bind(emailInput, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));
    facebookInput.addEventListener('input', isValid.bind(facebookInput, /(?:http:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/));
    twitterInput.addEventListener('input', isValid.bind(twitterInput, /@([A-Za-z0-9_]{1,15})/i));
    function isValid(reg) {
        var valid = reg.test(this.value);
        if (!valid && this.value !== '') {
            this.classList.add("invalid");
        }
        else{
            this.classList.remove("invalid");
        }
    }
//end of spellchecking

// showing and hiding modal tabs
    newContactBtn.onclick = function () {
        showTab.call(contactModal);
    };
    contactList.onclick = function (event) {
        var targ = event.target;
        var myKey = targ.parentElement.querySelector('.contact-number').innerText.replace(/ /g, "").replace(/\+/g, "");
        if (typeof localStorage[myKey] !== "undefined"
            && localStorage[myKey] !== "undefined") {
            var selectedItem = JSON.parse(localStorage[myKey]);
        }
        if (targ.classList.contains('glyphicon-remove')) {
            showTab.call(removeModal);
            removeModal.querySelector('.yes').onclick = function () {
                targ.parentElement.remove();
                delete localStorage[key];
                hideTab();
                updateFriendsCounter();
            };
            removeModal.querySelector('.no').onclick = function () {
                hideTab();
            }
        }
        if (targ.classList.contains('glyphicon-pencil')) {
            showTab.call(editModal);
            for (var key in selectedItem) {
                editModal.querySelector('.' + key).value = selectedItem[key];
            }
            editModal.querySelector('.save').onclick = function () {
                var myValue = function () {
                    var obj = {};
                    var children = editModal.querySelector('.i-group').children;
                    for (var i=0, max = children.length; i<max;i++){
                        if (children[i].value){
                            obj[(children[i].className)] = children[i].value;
                        }
                    }
                    return obj;
                };
                localStorage.setItem(myKey, JSON.stringify(myValue()));
                hideTab();
            };
            editModal.querySelector('.cancel').onclick = function () {
                hideTab();
            }
        }
        if (targ.classList.contains('visible')
            || targ.classList.contains('contact-name')
            || targ.classList.contains('glyphicon-option-horizontal')
            || targ.classList.contains('contact-number')) {
            showTab.call(infoModal);
            for (var key in selectedItem) {
                infoModal.querySelector('.' + key + '-info').innerText = selectedItem[key];
                infoModal.querySelector('.' + key + '-info').parentNode.classList.add('visible');
            }
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
        }
        if (tab.getAttribute('data-mode') === "info") {
            tab.classList.remove("open");
            [].slice.call(infoModal.querySelectorAll('.row td:last-child')).forEach(function (element) { element.innerText = ''; element.parentNode.classList.remove('visible')});
        }
        else{
            tab.classList.remove("open");
        }
    }
// end of showing and hiding modal tabs

    var btnSave = contactModal.querySelector('.save');
    btnSave.onclick =  function () {
        var noInvalidInput = [].slice.call(contactModal.querySelector('.i-group').children).every(element => !element.classList.contains('invalid'));
        if (noInvalidInput) {
            var myKey = contactModal.querySelector('.phone').value.replace(/ /g, "").replace(/\+/g, "");
            var myValue = function () {
                var obj = {};
                var children = contactModal.querySelector('.i-group').children;
                for (var i=0, max = children.length; i<max;i++){
                    if (children[i].value){
                        obj[(children[i].className)] = children[i].value;
                    }
                }
                return obj;
                };
            localStorage.setItem(myKey, JSON.stringify(myValue()));
            var newItem = JSON.parse(localStorage.getItem(myKey));
            var clone = emptyContact.cloneNode(true);
            clone.querySelector(".contact-name").textContent = newItem['name'];
            clone.querySelector(".contact-number").textContent  = newItem['phone'];
            list.insertBefore(clone, list.firstChild);
            updateFriendsCounter();
            clearAll();
            hideTab();
        }
    };


    clearAllBtn.onclick = clearAll;
    function clearAll() {
        [].slice.call(document.getElementsByClassName('i-group')[0].children).forEach(function (elem) {elem.value = null;});
        modalTab.querySelector('.name').classList.add('invalid');
        modalTab.querySelector('.phone').classList.add('invalid');
    }
    function updateFriendsCounter(){
        var visibleContacts = document.querySelectorAll('#contacts .visible').length;
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
