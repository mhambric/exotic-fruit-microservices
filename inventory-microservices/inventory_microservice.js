
const fs = require("fs"); // imported fs module to reach and write files locally 

// contrants are defined 
const REQUEST_FILE = "request.json";
const RESPONSE_FILE = "response.json";
const INVENTORY_FILE = "inventory.json";

// reads and parse JSON and returns the parsed JSON obkect or null if the file does not exist or cant be reead
function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;// Check if file exists 
    const data = fs.readFileSync(filePath, "utf8"); // Read file as a UTF-8 string
    return JSON.parse(data || "[]"); // Parse JSON, default to empty array if empty
  } catch (err) {
    return null;  // Return null if parsing or file reading fails
  }
}

// Function to safely write a JavaScript object to a JSON file.
// Converts the object to a formatted JSON string.
function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));// 2 space indentation for readability
  } catch (err) {
    console.error("Error writing JSON:", err);// Log an error if file writing fails
  }
}

// Main function that processes the request from request.json
function handleRequest() { // Step 1: Read and parse the request file
  const request = readJSON(REQUEST_FILE);

  if (!request || !request.action) {  // Step 2:Validate the request object and ensure an action is specified
    writeJSON(RESPONSE_FILE, {
      status: "Error",
      message: "Invalid or missing request action.", //  if invalid then stop execution here
    });
    return;
  }
 
  // Step 3: Load the existing inventory data (or use an empty array if none exists)
  const inventory = readJSON(INVENTORY_FILE) || [];
  let response;   // Prepare a variable to hold the result to send back


  // When a request has "action": "store", the service adds a new item to the inventory.
  try {
    switch (request.action.toLowerCase()) {
      case "store": { // Validate that the item contains required properties
        if (!request.item || !request.item.item_id || !request.item.name) {
          response = {
            status: "Error",
            message: "Missing required item data.",
          };
        } else { // Add the new item to the inventory array
          inventory.push(request.item);
          writeJSON(INVENTORY_FILE, inventory); // Save updated inventory back to file
          response = { //  success message if successful 
            status: "Success", 
            message: `Item '${request.item.name}' stored successfully.`,
          };
        }
        break;
      }
      
      
      
      // This allows another program to search for an item by name or ID.
      case "retrieve": { 
        const id = request.item_id;
        const name = request.name;
        let found = null;

        if (id) { // If an ID is provided, search by ID; otherwise, search by nam
          found = inventory.find((item) => item.item_id === id);
        } else if (name) {
          found = inventory.find((item) => item.name === name);
        }

        response = found // Return the item if found, otherwise "Not Found"
          ? { status: "Success", item: found }
          : { status: "Not Found", message: "Item not found." };
        break;
      }


      // This updates the data for an existing item by ID.
      case "edit": {
        const id = request.item_id;
        const updates = request.updates;

        if (!id || !updates) {  // Validate input: must have an ID and at least one update field

          response = {
            status: "Error",
            message: "Missing item_id or update data.",
          };
        } else { // Find the item by ID
          const index = inventory.findIndex((item) => item.item_id === id);
          if (index === -1) {
            response = { status: "Not Found", message: "Item not found." }; // If item not found, return error messege
          } else {
            inventory[index] = { ...inventory[index], ...updates }; // Merge existing item with updated fields
            writeJSON(INVENTORY_FILE, inventory); // Save the updated inventory back to file
            response = {
              status: "Success", // Return confirmation and the updated item with updated messege 
              message: `Item ${id} updated successfully.`,
              updatedItem: inventory[index],
            };
          }
        }
        break;
      }
      
      // Catches invalid or unknown actions and unexpected errors.
      default:
        response = { status: "Error", message: "Unknown action." }; // If the request action is not recognized gives messege
    }
  } catch (error) { // Catch unexpected runtime errors
    response = {
      status: "Error",
      message: "Error Unable to Perform Request",
    };
  }

  // Writes the result to response.json for the main program to read
  writeJSON(RESPONSE_FILE, response);
  console.log("Response written:", response);
}

// Run the microservice immediately when the file is executed.
handleRequest();
