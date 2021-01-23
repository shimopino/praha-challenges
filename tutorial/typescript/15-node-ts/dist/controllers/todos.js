"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodos = exports.updateTodos = exports.getTodos = exports.createTodo = void 0;
const todos_1 = require("../models/todos");
const TODOS = [];
const createTodo = (req, res, next) => {
    const text = req.body.text;
    const newTodo = new todos_1.Todo(Math.random().toString(), text);
    TODOS.push(newTodo);
    res.status(201);
    res.json({
        message: "TODOを作成しました。",
        createTodo: newTodo
    });
};
exports.createTodo = createTodo;
const getTodos = (req, res, next) => {
    res.json({ todos: TODOS });
};
exports.getTodos = getTodos;
const updateTodos = (req, res, next) => {
    const todoId = req.params.id;
    const updateText = req.body.text;
    const todoIndex = TODOS.findIndex(todo => todo.id === todoId);
    if (todoIndex < 0) {
        throw new Error("対象のTODOがみつかりませんでした");
    }
    TODOS[todoIndex] = new todos_1.Todo(todoId, updateText);
    res.json({
        message: "更新しました",
        updatedTodo: TODOS[todoIndex]
    });
};
exports.updateTodos = updateTodos;
const deleteTodos = (req, res, next) => {
    const todoId = req.params.id;
    const todoIndex = TODOS.findIndex(todo => todo.id === todoId);
    if (todoIndex < 0) {
        throw new Error("対象のTODOがみつかりませんでした");
    }
    TODOS.splice(todoIndex, 1);
    res.json({
        message: "削除しました"
    });
};
exports.deleteTodos = deleteTodos;
