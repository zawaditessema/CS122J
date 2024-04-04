/** OBJECT CONSTANTS **
 * These constants include an inventory object, resupply levels,
 * and ingredients for menu items. Some objects include methods,
 * which drive object behaviors. This section also include HTML
 * DOM targets for certain UI actions.
 */

const myForm = document.querySelector("#takeOrder");
const currOrder = document.querySelector("#currOrder");
const invDisplay = document.querySelector("#currInventory");
const orderHistory = document.querySelector("#orderHistory");

const Inventory = class {
  constructor(bun, patty, lettuce, tomato, pickle, pepperjack) {
    this.bun = bun;
    this.patty = patty;
    this.lettuce = lettuce;
    this.tomato = tomato;
    this.pickle = pickle;
    this.pepperjack = pepperjack;
  }
  useitem() {
    console.log("inventory.useitem method does nothing");
  }
  restock(levelsObj) {
    for (let item in levelsObj){
      this[item].qty += levelsObj[item];
    }
    this.show();
    historyLog('Inventory restocked at ${new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})}');
  }
  show() {
    let newMsg = "";
    let separator = "";
    for (let [itemname, count] of Object.entries(this)) {
      newMsg += `${separator}${itemname} : ${count.qty}`;
      separator = "<br />";
    }
    invDisplay.innerHTML = newMsg;
  }
};

const inventory = new Inventory(
  { unit: "bun", qty: 0 }, // bun
  { unit: "patty", qty: 0 }, // patty
  { unit: "cup", qty: 0 }, // lettuce
  { unit: "cup", qty: 0 }, // tomato
  { unit: "ounce", qty: 0 }, // pickle
  { unit: "slices", qty: 0 } // pepperjack
);

const resupplyLevels = {
  lettuce: 50,
  tomato: 50,
  pickle: 100,
  pepperjack: 20,
  patty: 50,
  bun: 75,
};

const mealIngredients = {
  regular: {
    bun: 2,
    patty: 1,
    lettuce: 0.5,
  },
  deluxe: {
    bun: 3,
    patty: 2,
    lettuce: 1,
    pickle: 3,
    tomato: 1,
  },
  spicy: {
    bun: 2,
    patty: 1,
    lettuce: 0.5,
    pickle: 2,
    pepperjack: 2,
    tomato: 1,
  },
};

const orderDetails = {
  orderNum: 0,
  custName: null,
  items: [],
  timestamp: null,
  show() {
    let msg = `Order #${this.orderNum}: ${this.custName} at ${this.timestamp}:<br /> ${JSON.stringify(this.items)}`;
    currOrder.innerHTML = msg;
    historyLog(msg);
  },
  process() {
    this.orderNum++;
    let canProcess = true;
    for (let item of this.items) {
      let ingredients = mealIngredients[item.itemname];
      for (let ingredient in ingredients) {
        let requiredQty = ingredients[ingredient] * item.count;
        if (inventory[ingredient].qty < requiredQty) {
          alert(`Insufficient ${ingredient} to fulfill the order.`);
          canProcess = false;
          break;
        }
      }
    }
    if (canProcess) {
      for (let item of this.items) {
        let ingredients = mealIngredients[item.itemname];
        for (let ingredient in ingredients) {
          let requiredQty = ingredients[ingredient] * item.count;
          inventory[ingredient].qty -= requiredQty;
        }
      }
      this.show();
      historyLog(`Order processed at ${new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})}`);
    }
  },
};

/** STANDALONE FUNCTION DEFINITIONS **
 * These functions are defined apart from object methods; however,
 * they can still leverage object methods
 */

const restockAndDisplay = (source) => {
  console.log("restockAndDisplay function does nothing");
  console.log(`Restocked at ${new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})}`);
};

const historyLog = (msg) => {
  let separator = "";
  if (orderHistory.innerHTML.length) {
    separator = "<hr />";
  }
  orderHistory.innerHTML += separator + msg;
};

/** INITIALIZATION ACTIONS **
 * These are actions that take place when the page initially
 * loads. Note the addition of a "submit" event listener on the
 * HTML form. This reflects the paradigm of event-driven
 * programming.
 */

document.querySelector("button").addEventListener("click", () => {
  restockAndDisplay(inventory);
});

window.onload = () => {
  for(let item in inventory) {
    if(inventory[item].qty === undefined) {
      inventory[item].qty = resupplyLevels[item];
    }
  }

  inventory.show();
  console.log("Initialization complete.");
};

myForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputs = event.target.querySelectorAll("select");
  orderDetails.custName = event.target.custName.value;
  orderDetails.timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });
  orderDetails.items.length = 0; // empty the order items array
  inputs.forEach(({ name: itemname, value }) => {
    if (value > 0) {
      orderDetails.items.push({ itemname: itemname, count: value });
    }
  });
  if (!orderDetails.items.length) {
    alert("OOPS! You didn't order any items.");
    return false;
  }

  orderDetails.process();
  orderDetails.show();
  inventory.show();
  myForm.reset();
});