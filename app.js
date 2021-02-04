//==========================================Storage Controller
const StorageCtrl = (function() {
    return {
        storeItem: function(item) {
            let items = []
            if (localStorage.getItem("items") === null) {
                items.push(item);
            } else {
                items = JSON.parse(localStorage.getItem("items"));
                items.push(item);
            }
            localStorage.setItem('items', JSON.stringify(items));
        },
        getItemsFromStorage() {
            let items;
            if (localStorage.getItem("items") === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem("items"));
            }
            return items;

        },
        updateLocalStorage: function(updatedItems) {

            let items = JSON.parse(localStorage.getItem("items"));
            items.forEach((item, index) => {
                if (updatedItems.id === item.id) {
                    items.splice(index, 1, updatedItems);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));

        },
        deleteStorageItem: function(id) {
            let items = JSON.parse(localStorage.getItem("items"));
            items.forEach((item, index) => {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearStorageItems: function() {
            localStorage.removeItem("items");
        }
    }
})();


//===========================================================Item Controller
const ItemCtrl = (function() {

    //Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    const data = {
            // items: [
            //     { id: 0, name: "Steak Dinner", calories: 1200 },
            //     { id: 1, name: "Cookie", calories: 500 },
            //     { id: 2, name: "Egg", calories: 400 }

            // ],
            items: StorageCtrl.getItemsFromStorage(),
            currentItem: null,
            totalCalories: 0
        }
        //--------------------------------Item Controller : Public Method

    return {
        logData: function() {
            return data;
        },
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;
            //Generate an ID for Data
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            calories = parseInt(calories);
            //Create a new item
            newItem = new Item(ID, name, calories);
            data.items.push(newItem);
            return newItem;
        },
        getTotalCalories: function() {
            let total = 0;
            data.items.forEach(item => {
                total += item.calories;
            });
            //set total calories in data structure
            data.totalCalories = total;
            return total;
        },

        //Find Element by ID to Edit
        getItemByID: function(id) {
            let found = null;
            data.items.forEach(item => {
                if (item.id == id) {
                    found = item;
                }
            })
            return found;
        },
        updateItem: function(name, calories) {
            calories = parseInt(calories);
            let found = null;
            //Get Element by Searching 
            data.items.forEach(item => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                    return found;
                }
            })

            return found;
        },
        deleteItem: function(currentItem) {
            data.items = data.items.filter(item => item.id != currentItem.id);
        },
        clearAllItems: function() {
            data.items = [];
        }


        ,
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        }

    }
})();


//========================================================= UI Controller =========================
const UICtrl = (function() {
    const UISelectors = {
        itemList: "#item-list",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories",
        backBtn: ".back-btn",
        clearBtn: ".clear-btn"
    }

    //-------------------------------------------------UI Controller : Public Method

    return {
        populateItems: function(items) {
            let html = "";
            items.forEach(element => {
                html += `<li class="collection-item" id="item-${element.id}">
            <strong>${element.name}: </strong> <em>${element.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>`;
            });

            //Insert List Item
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelector: function() {
            return UISelectors;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            //Create LI Element
            const li = document.createElement("li");
            //Add Class
            li.className = "collection-item";
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
            //insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
        },
        updateListItem: function(listItem) {
            let list = document.querySelector(`#item-${listItem.id}`);
            list.innerHTML = `<strong>${listItem.name}: </strong> <em>${listItem.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
        },
        deleteItem: function(currentItem) {
            let list = document.querySelector(`#item-${currentItem.id}`);
            list.remove();

        },
        clearAllItems: function() {
            document.querySelector(UISelectors.itemList).innerHTML = "";

        }

        ,
        clearFields: function() {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },
        addTotalCalorie: function(total) {
            document.querySelector(UISelectors.totalCalories).innerText = total;

        },
        clearEditState: function() {
            UICtrl.clearFields();
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline";
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = "inline";
            document.querySelector(UISelectors.deleteBtn).style.display = "inline";
            document.querySelector(UISelectors.backBtn).style.display = "inline";
            document.querySelector(UISelectors.addBtn).style.display = "none";
        },
        addItemToForm: function() {
            const currentItem = ItemCtrl.getCurrentItem();
            document.querySelector(UISelectors.itemNameInput).value = currentItem.name;
            document.querySelector(UISelectors.itemCaloriesInput).value = currentItem.calories;

        }
    }
})();


//========================================================  App Controller  ========================
const App = (function(ItemCtrl, UICtrl, StorageCtrl) {
    //Load Event Listener
    const loadEventListener = function() {
        //Get UI Selectors
        const UISelectors = UICtrl.getSelector();

        //Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);
        //Disable Enter Button
        document.addEventListener("keypress", e => {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    return false;
                }
            })
            //Edit Icon Click Event
        document.querySelector(UISelectors.itemList).addEventListener("click", ItemEditClicked);
        //Update button clicked
        document.querySelector(UISelectors.updateBtn).addEventListener("click", updateItemSubmit);
        document.querySelector(UISelectors.deleteBtn).addEventListener("click", deleteItemSubmit);
        document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemsClick);
        document.querySelector(UISelectors.backBtn).addEventListener("click", e => {
            e.preventDefault();
            UICtrl.clearEditState()
        });

    }

    //................................Add Item button clicked
    const itemAddSubmit = function(e) {
        e.preventDefault()
            //Get form input from UI controller
        const input = UICtrl.getItemInput();
        //Check for empty input
        if (input.name !== "" && input.calories != "") {
            //Add Item to Data Structure
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //Add Item to UI List
            UICtrl.addListItem(newItem);

            //Update Total Calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add Total Calorie to UI
            UICtrl.addTotalCalorie(totalCalories);

            //Store in local storage
            StorageCtrl.storeItem(newItem);

            //Clear Input Fields
            UICtrl.clearFields();
        }
    }

    //............................Button Clicked for editing items
    const ItemEditClicked = function(e) {
        e.preventDefault();
        //Check if edit button clicked
        if (e.target.classList.contains("edit-item")) {
            //Get List Item ID
            let ListID = e.target.parentNode.parentNode.id;
            //Extract Actual ID
            ListID = parseInt(ListID.split("-")[1]);
            //Get Item by ID
            const itemToEdit = ItemCtrl.getItemByID(ListID);
            //Set Current Item
            ItemCtrl.setCurrentItem(itemToEdit);
            //Add Item to Form
            UICtrl.addItemToForm();
            //Show Edit State
            UICtrl.showEditState();
        }
    }


    //.................clicked item Update Button
    const updateItemSubmit = function(e) {

        e.preventDefault();
        const inputItem = UICtrl.getItemInput();
        //Update Items in Data Structure 
        const UpdatedItem = ItemCtrl.updateItem(inputItem.name, inputItem.calories);
        //Update Items in UI
        UICtrl.updateListItem(UpdatedItem);
        //Update Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add Total Calorie to UI
        UICtrl.addTotalCalorie(totalCalories);

        //Items Updated- Now Clear Edit State
        UICtrl.clearEditState();

        //Update in Local Storage
        StorageCtrl.updateLocalStorage(UpdatedItem);
    }

    //............................Delete Item Button Clicked
    const deleteItemSubmit = function(e) {
            e.preventDefault();
            let currentItem = ItemCtrl.getCurrentItem();
            //Delete From Data Structure 
            ItemCtrl.deleteItem(currentItem);
            //Update Total Calories from Data Structure
            const totalCalories = ItemCtrl.getTotalCalories();
            //Update Total Calorie to UI
            UICtrl.addTotalCalorie(totalCalories);

            //Delete from UI
            UICtrl.deleteItem(currentItem);
            //Items Updated- Now Clear Edit State
            UICtrl.clearEditState();

            //Delete Item From Local Storage

            StorageCtrl.deleteStorageItem(currentItem.id);
        }
        //.......................Clear All Items 
    const clearAllItemsClick = function(e) {
        //Clear All from Data Structure
        ItemCtrl.clearAllItems();
        //Now Remove All from UI 
        UICtrl.clearAllItems();

        //Clear input field and edit state
        UICtrl.clearEditState();

        //Clear Items from Storage
        StorageCtrl.clearStorageItems();

    }

    return {
        //-------------------------------------------------App Controller : Public Method
        init: function() {
            //Fetch Items from data Structure
            const items = ItemCtrl.getItems();
            //Populate Item List
            UICtrl.populateItems(items);

            //Update Total Calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add Total Calorie to UI
            UICtrl.addTotalCalorie(totalCalories);

            //Initially Hide Edit State
            UICtrl.clearEditState();

            //Lad Event Listener
            loadEventListener();
        }
    }
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();