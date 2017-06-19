document.addEventListener("DOMContentLoaded", function() {

    var emptyContact = document.getElementsByClassName("empty-contact")[0].children[0];
    var searchField = document.getElementById('search-text');
    var overlay = document.getElementById('overlay');
    var list = document.querySelector('.list-group');
    var contactModal = document.getElementById('contact-modal');
    var modalTab = document.querySelector(".modal-tab");
    var newContactBtn = document.querySelector('.new-contact');
    var clearAllBtn = document.querySelector('.clear');
    var nameInput = document.querySelectorAll(".name");
    var numInput = document.querySelectorAll(".phone");
    var emailInput = document.querySelectorAll(".email");
    var facebookInput = document.querySelectorAll(".facebook");
    var twitterInput = document.querySelectorAll(".twitter");
    var contactList = document.querySelector('.contact-list');
    var infoModal = document.getElementById("info-modal");
    var removeModal = document.getElementById("remove-modal");
    var editModal = document.getElementById("edit-modal");

    var keys = [];
    if (typeof localStorage['keys'] !== "undefined"
        && localStorage['keys'] !== "undefined") {
        var oldKeys = JSON.parse(localStorage['keys']);
        for (var i = 0, max = oldKeys.length; i < max; i++) {
            keys.push(oldKeys[i]);
        }
    }
    function createList() {
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0, max = keys.length; i < max; i++) {
            // console.log(typeof localStorage[keys[0][i+3]]);
            if (typeof localStorage[keys[i]] !== "undefined"
                && localStorage[keys[i]] !== "undefined") {
                var newItem = JSON.parse(localStorage[keys[i]]);
                var clone = emptyContact.cloneNode(true);
                clone.querySelector(".contact-name").textContent = newItem['name'];
                clone.querySelector(".contact-number").textContent = newItem['phone'];
                list.insertBefore(clone, list.firstChild);
            }
        }
    }
    createList();

    updateFriendsCounter();


    // searching process

    searchField.onkeyup = function () {
        var listItem = list.querySelectorAll(".list-group-item");
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

    for (var j=0, maxName = nameInput.length; j<maxName;j++) {
        nameInput[j].addEventListener('input', function () {
            if (this.value !== '') {
                this.classList.remove("invalid");
            }
            else {
                this.classList.add("invalid");
            }
        });
        numInput[j].addEventListener('input', function () {
            var re = /[^+?|\d\-() ]/;
            if (re.test(this.value)) {
                this.value = this.value.replace(re, '');
            }
            if (this.value !== '') {
                this.classList.remove("invalid");
            }
            else {
                this.classList.add("invalid");
            }
        });
        emailInput[j].addEventListener('input', isValid.bind(emailInput[j], /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));
        facebookInput[j].addEventListener('input', isValid.bind(facebookInput[j], /(?:http:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/));
        twitterInput[j].addEventListener('input', isValid.bind(twitterInput[j], /@([A-Za-z0-9_]{1,15})/i));
        function isValid(reg) {
            var valid = reg.test(this.value);
            if (!valid && this.value !== '') {
                this.classList.add("invalid");
            }
            else {
                this.classList.remove("invalid");
            }
        }
    }
//end of spellchecking

// showing and hiding modal tabs
    newContactBtn.onclick = function () {
        showTab.call(contactModal);
        nameInput[0].focus();
    };
    contactList.onclick = function (event) {
        var targ = event.target;
        var selectedItem;
        var myKey = targ.parentElement.querySelector('.contact-number').innerText.replace(/ /g, "").replace(/\+/g, "");

        if (typeof localStorage[myKey] !== "undefined"
            && localStorage[myKey] !== "undefined") {
            selectedItem = JSON.parse(localStorage[myKey]);
        }
        if (targ.classList.contains('glyphicon-remove')) {
            showTab.call(removeModal);
            removeModal.querySelector('.yes').onclick = function () {
                targ.parentElement.remove();

                keys.forEach(function (element, index, arr) { if (element === myKey) arr.splice(index, 1) });
                localStorage['keys'] = JSON.stringify(keys);
                delete localStorage[myKey];
                createList();
                hideTab();
                updateFriendsCounter();
            };
            removeModal.querySelector('.no').onclick = function () {
                hideTab();
            }
        }
        if (targ.classList.contains('glyphicon-pencil')) {
            showTab.call(editModal);
            nameInput[1].focus();
            clearAll();
            for (var key in selectedItem) {
                if (selectedItem.hasOwnProperty(key)) {
                    editModal.querySelector('.' + key).value = selectedItem[key];
                }
            }
            editModal.querySelector('.save').onclick = function () {
                var myValue = function () {
                    var obj = {};
                    var iGroup = editModal.querySelector('.i-group');
                    var newKey = iGroup.querySelector('.phone').value.replace(/ /g, "").replace(/\+/g, "");
                    if(newKey !== myKey){
                        keys.forEach(function (element, index, arr) { if (element === myKey) arr.splice(index, 1, newKey); });
                        myKey = newKey;
                        localStorage['keys'] = JSON.stringify(keys);
                        targ.parentElement.querySelector('.contact-number').textContent = iGroup.querySelector('.phone').value;
                    }
                    for (var i=0, max = iGroup.children.length; i<max;i++){
                        if (iGroup.children[i].value){
                            obj[(iGroup.children[i].className)] = iGroup.children[i].value;
                        }
                    }
                    return obj;
                };
                myKey = myValue()['phone'].replace(/ /g, "").replace(/\+/g, "");
                localStorage[myKey] = JSON.stringify(myValue());
                if (typeof localStorage[myKey] !== "undefined"
                    && localStorage[myKey] !== "undefined") {
                    selectedItem = JSON.parse(localStorage[myKey]);
                    targ.parentElement.querySelector('.contact-name').textContent = selectedItem['name'];
                    targ.parentElement.querySelector('.contact-number').textContent = selectedItem['phone'];
                }
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
            selectedItem = JSON.parse(localStorage[myKey]);
            for (var prop in selectedItem) {
                if (selectedItem.hasOwnProperty(prop)) {
                    infoModal.querySelector('.' + prop + '-info').innerText = selectedItem[prop];
                    infoModal.querySelector('.' + prop + '-info').parentNode.classList.add('visible');
                }
            }
        }
    };
    document.onkeydown = function (event) {
        if (event.keyCode === 27) {
            clearAll();
            hideTab();
        }
    };
    modalTab.onclick = function (event) {
        if (event.target === overlay || event.target === document.querySelector('.open .modal-close') ) {
            clearAll();
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
        var noInvalidInput = [].slice.call(contactModal.querySelector('.i-group').children).every(elem=> !elem.classList.contains('invalid'));
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
            localStorage[myKey] = JSON.stringify(myValue());
            keys.push(myKey);
            localStorage['keys'] = JSON.stringify(keys);
            // var newItem = JSON.parse(localStorage[myKey]);
            // var clone = emptyContact.cloneNode(true);
            // clone.querySelector(".contact-name").textContent = newItem['name'];
            // clone.querySelector(".contact-number").textContent  = newItem['phone'];
            // list.insertBefore(clone, list.firstChild);
            createList();
            updateFriendsCounter();
            clearAll();
            hideTab();
        }
    };


    clearAllBtn.onclick = clearAll;
    function clearAll() {
        if (document.querySelector('.open').getElementsByClassName('i-group')[0]) {
            var children = document.querySelector('.open').getElementsByClassName('i-group')[0].children;
            for (var i = 0, max = children.length; i < max; i++) {
                children[i].value = null;
            }
            modalTab.querySelector('.name').classList.add('invalid');
            modalTab.querySelector('.phone').classList.add('invalid');
        }
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
