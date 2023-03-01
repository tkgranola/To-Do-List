/**
 * initial_model is a simple JavaScript Object with two keys and no methods.
 * it is used both as the "initial" model when mounting the Todo List App
 * and as the "reset" state when all todos are deleted at once.
 */
var initial_model = {
    todos: [], // empty array which we will fill shortly
    hash: "#/" // the hash in the url (for routing)
  }
  


//Function implementation
/**
 * `update` transforms the `model` based on the `action`.
 * @param {String} action - the desired action to perform on the model.
 * @param {Object} model - the App's (current) model (or "state").
 * @param {String} data - data to apply to the item.
 * @return {Object} new_model - the transformed model.
 */
function update(action, model, data) {
  var dupe_model = JSON.parse(JSON.stringify(app.model))
  switch (action) {                  // action (String) determines which case
    case 'add':                      // if action = 'add' then do
      dupe_model.todos.push({        //'Pushing' New items to models.todos array
        id: model.todos.length + 1,  //Adding length
        title: data,                 //Adding input 'data' as title
        done: false                  //Adding done for tick yes or no
      })
      break;   
    default:                         // if action unrecognised or undefined,
      return model;                 // return model unmodified
  }  
  return dupe_model;
 }

















//This is what needs exporting for test.js
/* module.exports is needed to run the functions using Node.js for testing! */
/* istanbul ignore next */
if (typeof module !== 'undefined' && module.exports) {
   module.exports = {
     model: initial_model,
     update: update
  }
}