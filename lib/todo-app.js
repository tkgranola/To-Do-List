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
  var dupe_model = JSON.parse(JSON.stringify(model))
  switch (action) {                             // action (String) determines which case
    
    case 'ADD':                                 // if action = 'add' then do
      dupe_model.todos.push({                   //'Pushing' New items to models.todos array
        id: model.todos.length + 1,             //Adding length
        title: data,                            //Adding input 'data' as title
        done: false                             //Adding done for tick yes or no
      })
      break;  

    case 'TOGGLE':                              //'Toggle' Done tick box
      dupe_model.todos.forEach(function(item){
        if(item.id === data){
          item.done = !item.done;               //Swapping false/true
        }
      });
      break;

    default:                                    // if action unrecognised or undefined,
      return model;                             // return model unmodified
  }  
  return dupe_model;
 }

/* if require is available, it means we are in Node.js Land i.e. testing! */
/* istanbul ignore next */
if (typeof require !== 'undefined' && this.window !== this) {
  var { a, button, div, empty, footer, input, h1, header, label, li, mount,
    route, section, span, strong, text, ul } = require('./elmish.js');
}

 //Rendering items into html
/**
 * 'render_item' creates a DOM "tree" with a single to-do list item
 * @param {object} item the todo item object
 * @param {object} <li> DOM Tree which is nested in <ul>
 */
function render_item(item) {
  return (
    li([
      "data-id=" + item.id,
      "id=" + item.id,
      item.done ? "class=completed" : ""
    ], [
      div(["class=view"], [
        input(["class=toggle", "type=checkbox",
          (item.done ? "checked=true" : "")], []),
        label([], [text(item.title)]),
        button(["class=destroy"])
      ]) // </div>
    ]) // </li>
  )
}




















//This is what needs exporting for test.js
/* module.exports is needed to run the functions using Node.js for testing! */
/* istanbul ignore next */
if (typeof module !== 'undefined' && module.exports) {
   module.exports = {
     model: initial_model,
     update: update,
     render_item: render_item
  }
}