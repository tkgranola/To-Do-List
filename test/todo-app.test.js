// This is the set up for the test doc 
const test = require('tape');       // https://github.com/dwyl/learn-tape
const fs = require('fs');           // to read html files (see below)
const path = require('path');       // so we can open files cross-platform
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'));
require('jsdom-global')(html);      // https://github.com/rstacruz/jsdom-global
const app = require('../lib/todo-app.js'); // functions to test
const id = 'test-app';              // all tests use 'test-app' as root element

//Now we start to write our tests for todo-app
//First tests to check if array is an array and has todos and hash
test('todo `model` (Object) has desired keys', function (t) {
    const keys = Object.keys(app.model);
    t.deepEqual(keys, ['todos', 'hash'], "`todos` and `hash` keys are present.");
    t.true(Array.isArray(app.model.todos), "model.todos is an Array")
    t.end();
  });

  