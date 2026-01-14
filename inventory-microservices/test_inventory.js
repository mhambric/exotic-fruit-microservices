// test_inventory.js
const fs = require("fs");
const { execSync } = require("child_process");

function sendRequest(request) {
  fs.writeFileSync("request.json", JSON.stringify(request, null, 2));
  console.log("Request sent:", request);

  // Run microservice
  execSync("node inventory_microservice.js");

  const response = JSON.parse(fs.readFileSync("response.json", "utf8"));
  console.log("Response received:", response);
  console.log("----------------------------------\n");
}

// ---  4 TEST CASES store, retrive, edit, retrives updated item ---

// store item
sendRequest({
  action: "store",
  item: {
    item_id: 1,
    name: "item_1",
    quantity: 20,
    price: 2.5,
  },
});

//  retrieve item
sendRequest({
  action: "retrieve",
  item_id: 1,
});

// edit item
sendRequest({
  action: "edit",
  item_id: 1,
  updates: { price: 3.0, quantity: 25 },
});

// retrieves the latest version of the item that was last updated to confirm that the edit worked 
sendRequest({
  action: "retrieve",
  item_id: 1,
});
