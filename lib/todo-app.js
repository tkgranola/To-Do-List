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

// render main function
/**
 * `render_main` renders the `<section class="main">` of the Todo List App
 * which contains all the "main" controls and the `<ul>` with the todo items.
 * @param {Object} model - the App's (current) model (or "state").
 * @param {Function} singal - the Elm Architicture "dispacher" which will run
 * @return {Object} <section> DOM Tree which containing the todo list <ul>, etc.
 */
function render_main (model, signal) {
  // Requirement #1 - No Todos, should hide #footer and #main
  var display = "style=display:"
    + (model.todos && model.todos.length > 0 ? "block" : "none");

  return (
    section(["class=main", "id=main", display], [ // hide if no todo items.
      input(["id=toggle-all", "type=checkbox",
        typeof signal === 'function' ? signal('TOGGLE_ALL') : '',
        (model.all_done ? "checked=checked" : ""),
        "class=toggle-all"
      ], []),
      label(["for=toggle-all"], [ text("Mark all as complete") ]),
      ul(["class=todo-list"],
        (model.todos && model.todos.length > 0) ?
        model.todos
        .filter(function (item) {
          switch(model.hash) {
            case '#/active':
              return !item.done;
            case '#/completed':
              return item.done;
            default: // if hash doesn't match Active/Completed render ALL todos:
              return item;
          }
        })
        .map(function (item) {
          return render_item(item, model, signal)
        }) : null
      ) // </ul>
    ]) // </section>
  )
}


/**
 * `render_footer` renders the `<footer class="footer">` of the Todo List App
 * which contains count of items to (still) to be done and a `<ul>` "menu"
 * with links to filter which todo items appear in the list view.
 * @param {Object} model - the App's (current) model (or "state").
 * @return {Object} <section> DOM Tree which containing the <footer> element.
 * @example
 * // returns <footer> DOM element with other DOM elements nested:
 * var DOM = render_footer(model);
 */
function render_footer (model, signal) {

  // count how many "active" (not yet done) items by filtering done === false:
  var done = (model.todos && model.todos.length > 0) ?
    model.todos.filter( function (i) { return i.done; }).length : 0;
  var count = (model.todos && model.todos.length > 0) ?
    model.todos.filter( function (i) { return !i.done; }).length : 0;

  // Requirement #1 - No Todos, should hide #footer and #main
  var display = (count > 0 || done > 0) ? "block" : "none";

  // number of completed items:
  var done = (model.todos && model.todos.length > 0) ?
    (model.todos.length - count) : 0;
  var display_clear =  (done > 0) ? "block;" : "none;";

  // pluarisation of number of items:
  var left = (" item" + ( count > 1 || count === 0 ? 's' : '') + " left");

  return (
    footer(["class=footer", "id=footer", "style=display:" + display], [
      span(["class=todo-count", "id=count"], [
        strong(count),
        text(left)
      ]),
      ul(["class=filters"], [
        li([], [
          a([
            "href=#/", "id=all", "class=" +
            (model.hash === '#/' ? "selected" : '')
          ],
          [text("All")])
        ]),
        li([], [
          a([
            "href=#/active", "id=active", "class=" +
            (model.hash === '#/active' ? "selected" : '')
          ],
          [text("Active")])
        ]),
        li([], [
          a([
            "href=#/completed", "id=completed", "class=" +
            (model.hash === '#/completed' ? "selected" : '')
          ],
          [text("Completed")])
        ])
      ]), // </ul>
      button(["class=clear-completed", "style=display:" + display_clear,
        typeof signal === 'function' ? signal('CLEAR_COMPLETED') : ''
        ],
        [
          text("Clear completed")
        ]
      )
    ])
  )
}

/**
 * `view` renders the entire Todo List App
 * which contains count of items to (still) to be done and a `<ul>` "menu"
 * with links to filter which todo items appear in the list view.
 * @param {Object} model - the App's (current) model (or "state").
 * @return {Object} <section> DOM Tree which containing all other DOM elements.
 * @example
 * // returns <section class="todo-app"> DOM element with other DOM els nested:
 * var DOM = view(model);
 */

function view (model,signal) {
  return( 
    section(["class=todoapp"], [
      header(["class=header"], [
        h1([], [
          text("todos")
        ]),
        input([
          "id=new-todo",
          "class=new-todo",
          "placeholder=What needs to be done?",
          "autofocus"
        ], [])
      ]),
      render_main(model,signal),
      render_footer(model,signal)
    ])
  );
}
  
























//This is what needs exporting for test.js
/* module.exports is needed to run the functions using Node.js for testing! */
/* istanbul ignore next */
if (typeof module !== 'undefined' && module.exports) {
   module.exports = {
     model: initial_model,
     update: update,
     render_item: render_item,
     render_main: render_main,
     render_footer: render_footer,
     view: view
  }
}