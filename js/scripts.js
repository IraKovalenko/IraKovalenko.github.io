document.addEventListener("DOMContentLoaded", function() {

    // Setting variables.
    var emptyContact = document.getElementsByClassName("empty-contact")[0].children[0];
    var searchField = document.getElementById('search-text');
    var overlay = document.getElementById('overlay');
    var list = document.querySelector('.list-group');
    var contactModal = document.getElementById('contact-modal');
    var modalTab = document.querySelector(".modal-tab");
    var newContactBtn = document.querySelector('.new-contact');
    var clearAllBtn = document.querySelector('.clear');
    var btnSave = contactModal.querySelector('.save');
    var nameInput = document.querySelectorAll(".name");
    var numInput = document.querySelectorAll(".phone");
    var emailInput = document.querySelectorAll(".email");
    var facebookInput = document.querySelectorAll(".facebook");
    var twitterInput = document.querySelectorAll(".twitter");
    var contactList = document.querySelector('.contact-list');
    var infoModal = document.getElementById("info-modal");
    var removeModal = document.getElementById("remove-modal");
    var editModal = document.getElementById("edit-modal");
    var rewriteModal = document.getElementById("rewrite-modal");

    var keys = [];
    // Checking whether localStorage is empty.
    if (typeof localStorage['keys'] !== "undefined"
        && localStorage['keys'] !== "undefined") {
        var oldKeys = JSON.parse(localStorage['keys']);
        for (var i = 0, max = oldKeys.length; i < max; i++) {
            keys.push(oldKeys[i]);
        }
    }
    createList();
    updateFriendsCounter();

    /**
     * Searching process. Delete all spaces and '+' signs for searching term.
     */
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

    /**
     * Showing and hiding modal tab for creating new contact.
     */
    newContactBtn.onclick = function () {
        // Open modal tab for creating new contact and gives focus for first input field.
        showTab.call(contactModal);
        nameInput[0].focus();
        // Spellchecking of inputs while entering contacts info.
        for (var j=0, maxName = nameInput.length; j<maxName;j++) {
            nameInput[j].addEventListener('input', function () {
                if (this.value !== '')
                    this.classList.remove("invalid");
                else
                    this.classList.add("invalid");
            });
            numInput[j].addEventListener('input', function () {
                var re = /[^+?|\d\-() ]/;
                if (re.test(this.value))
                    this.value = this.value.replace(re, '');
                if (this.value !== '')
                    this.classList.remove("invalid");
                else
                    this.classList.add("invalid");

            });
            emailInput[j].addEventListener('input', isValid.bind(emailInput[j], /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));
            facebookInput[j].addEventListener('input', isValid.bind(facebookInput[j], /(?:http:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/));
            twitterInput[j].addEventListener('input', isValid.bind(twitterInput[j], /@([A-Za-z0-9_]{1,15})/i));
            /**
             * Function checks whether entered value is fits for regExp.
             * @function isValid
             * @param {Object} reg - RegExp
             */
            function isValid(reg) {
                var valid = reg.test(this.value);
                if (!valid && this.value !== '')
                    this.classList.add("invalid");
                else
                    this.classList.remove("invalid");
            }
        }
        clearAllBtn.onclick = clearAll;
    };

    /**
     * Feedbacks on clicking on contact list item. Opens remove, edit and info modal tabs.
     * @param event
     */
    contactList.onclick = function (event) {
        var targ = event.target;
        var selectedItem;
        var myKey = targ.parentElement.querySelector('.contact-number').textContent.replace(/ /g, "").replace(/\+/g, "");
        // Checking whether localStorage is empty.
        if (typeof localStorage[myKey] !== "undefined"
            && localStorage[myKey] !== "undefined")
            selectedItem = JSON.parse(localStorage[myKey]);
        // Modal tab to open when remove btn is pressed.
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
        // Modal tab to open when edit btn is pressed.
        if (targ.classList.contains('glyphicon-pencil')) {
            showTab.call(editModal);
            nameInput[1].focus();
            for (var key in selectedItem) {
                if (selectedItem.hasOwnProperty(key))
                    editModal.querySelector('.' + key).value = selectedItem[key];
            }
            /**
             * Creating new or updating already existed contact on save btn pressing.
             */
            editModal.querySelector('.save').onclick = function () {
                var noInvalidInput = [].slice.call(editModal.querySelector('.i-group').children).every(elem => !elem.classList.contains('invalid'));
                var iGroup = editModal.querySelector('.i-group');
                var newKey = iGroup.querySelector('.phone').value.replace(/ /g, "").replace(/\+/g, "");
                var getValue = function () {
                    var obj = {};
                    for (var i = 0, max = iGroup.children.length; i < max; i++) {
                        if (iGroup.children[i].value)
                            obj[(iGroup.children[i].className)] = iGroup.children[i].value;
                    }
                    return obj;
                };
                if (noInvalidInput) {
                    /**
                     * If newly entered number differ from old one.
                     */
                    if (newKey !== myKey) {
                        /**
                         * If newly entered number already exists in phonebook.
                         */
                        if (keys.indexOf(newKey) !== -1) {
                            showTab.call(rewriteModal);
                            rewriteModal.querySelector('.yes').onclick = function () {
                                delete localStorage[myKey];
                                delete localStorage[newKey];
                                /**
                                 * Checks keys array for a number and deletes.
                                 */
                                keys.forEach(function (element, index, arr) {
                                    if (element === myKey) arr.splice(index, 1);
                                });
                                localStorage['keys'] = JSON.stringify(keys);
                                localStorage[newKey] = JSON.stringify(getValue());
                                /**
                                 * Checks whether children have new phone number and adds name to the element.
                                 * @borrows Array.prototype.forEach() as list.children method.
                                 */
                                [].slice.call(list.children).forEach(function (element) {
                                    if (element.querySelector('.contact-number').textContent === newKey)
                                        element.querySelector('.contact-name').textContent = editModal.querySelector('.name').value;
                                    else if (element.querySelector('.contact-number').textContent === myKey)
                                        element.remove();
                                });
                                createList();
                                hideTab();
                                hideTab();
                            };
                            /**
                             * Hiding tab when 'no' btn is pressed.
                             */
                            rewriteModal.querySelector('.no').onclick = function () {
                                hideTab();
                                hideTab();
                            };
                        } else {
                            targ.parentElement.remove();
                            /**
                             * Checks keys array for an old phone number,deletes it and paste new one.
                             */
                            keys.forEach(function (element, index, arr) {
                                if (element === myKey) arr.splice(index, 1, newKey);
                            });
                            delete localStorage[myKey];
                            localStorage['keys'] = JSON.stringify(keys);
                            localStorage[newKey] = JSON.stringify(getValue());
                            targ.parentElement.querySelector('.contact-number').textContent = iGroup.querySelector('.phone').value;
                            createList();
                            hideTab();
                        }
                    } else {
                        localStorage[myKey] = JSON.stringify(getValue());
                        /**
                         * Checking whether localStorage is empty.
                         */
                        if (typeof localStorage[myKey] !== "undefined"
                            && localStorage[myKey] !== "undefined") {
                            selectedItem = JSON.parse(localStorage[myKey]);
                            targ.parentElement.querySelector('.contact-name').textContent = selectedItem['name'];
                            targ.parentElement.querySelector('.contact-number').textContent = selectedItem['phone'];
                        }
                        hideTab();
                    }
                }
            };
            editModal.querySelector('.cancel').onclick = function () {
                hideTab();
            }
        }
        // Modal tab to open when info btn or contact were pressed.
        if (targ.classList.contains('visible')
            || targ.classList.contains('contact-name')
            || targ.classList.contains('glyphicon-option-horizontal')
            || targ.classList.contains('contact-number')) {
            showTab.call(infoModal);
            selectedItem = JSON.parse(localStorage[myKey]);
            for (var prop in selectedItem) {
                if (selectedItem.hasOwnProperty(prop)) {
                    infoModal.querySelector('.' + prop + '-info').textContent = selectedItem[prop];
                    infoModal.querySelector('.' + prop + '-info').parentNode.classList.add('visible');
                }
            }
        }
    };

    /**
     * Close modal tab on ESC pressing.
     * @param event
     */
    document.onkeydown = function (event) {
        if (event.keyCode === 27)
            hideTab();
    };

    /**
     * Close modal tab on overlay or close-btn pressing.
     * @param event
     */
    modalTab.onclick = function (event) {
        if (event.target === overlay || event.target === document.querySelector('.open .modal-close'))
            hideTab();
    };

    /**
     * Creating new contact on save btn clicking.
     */
    btnSave.onclick =  function () {
        // Checking whether an invalid inputs exist. Borrows Array.prototype.every() as i-group.children method.
        // If set to true, the function will continue contact's creating.
        var noInvalidInput = [].slice.call(contactModal.querySelector('.i-group').children).every(elem => !elem.classList.contains('invalid'));
        if (noInvalidInput) {
            var myKey = contactModal.querySelector('.phone').value.replace(/ /g, "").replace(/\+/g, "");
            /**
             * Function gathers info about contact from inputs.
             * @function getValue
             * @returns {{}} Object that made from gathering input fields info.
             */
            var getValue = function () {
                var obj = {};
                var children = contactModal.querySelector('.i-group').children;
                for (var i=0, max = children.length; i<max;i++){
                    if (children[i].value){
                        obj[(children[i].className)] = children[i].value;
                    }
                }
                return obj;
            };
            if (keys.indexOf(myKey) !== -1) {
                showTab.call(rewriteModal);
                rewriteModal.querySelector('.yes').onclick = function () {
                    localStorage[myKey] = JSON.stringify(getValue());
                    [].slice.call(list.children).forEach(function (element) {
                        if (element.querySelector('.contact-number').textContent === myKey)
                            element.querySelector('.contact-name').textContent = contactModal.querySelector('.name').value;
                    });
                    hideTab();
                    hideTab();
                };
                rewriteModal.querySelector('.no').onclick = function () {
                    hideTab();
                    hideTab();
                };
            } else {
                localStorage[myKey] = JSON.stringify(getValue());
                keys.push(myKey);
                localStorage['keys'] = JSON.stringify(keys);
                createList();
                updateFriendsCounter();
                hideTab();
            }
        }
    };

    /**
     *Function creates fully new list of contacts from localStorage.
     * @function createList
     */
    function createList() {
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0, max = keys.length; i < max; i++) {
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

    /**
     * Function clears all inputs and sets name and phone fields as 'required'.
     * @function clearAll
     */
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

    /**
     * Function updates an amount of friends that is displayed in the bottom of the list.
     * @function updateFriendsCounter
     */
    function updateFriendsCounter(){
        var visibleContacts = document.querySelectorAll('#contacts .visible').length;
        var friendsCounter = document.querySelector(".list-count");
        if (visibleContacts === 1){
            contactList.classList.remove('empty');
            friendsCounter.textContent = visibleContacts + ' friend';
        } else if(visibleContacts === 0){
            // shows empty state text when no contacts found
            contactList.classList.add('empty');
            friendsCounter.textContent = "";
        } else {
            contactList.classList.remove('empty');
            friendsCounter.textContent = visibleContacts + ' friends';
        }
    }

    /**
     * Open modal tab.
     * @function showTab
     */
    function showTab() {
        modalTab.classList.add("fade-in");
        this.classList.add("open");
        event.stopPropagation();
    }

    /**
     * Hide modal tab and clear inputs for contactModal and editModal tabs.
     *  @function hideTab
     */
    function hideTab(){
        var tab = document.querySelector('.open');
        modalTab.classList.remove("fade-in");
        if (tab.getAttribute('data-mode') === "add" || tab.getAttribute('data-mode') === "edit" )
            clearAll();
        if (tab.getAttribute('data-mode') === "info")
            [].slice.call(infoModal.querySelectorAll('.row td:last-child')).forEach(function (element) {
                element.textContent = ''; element.parentNode.classList.remove('visible')});
        tab.classList.remove("open");
    }
});
