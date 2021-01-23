// import {Request, Response, NextFunction} from "express";
import { RequestHandler } from "express";
import  { Todo } from "../models/todos";

const TODOS: Todo[] = [];

// export const createTodo = (req: Request, res: Response, next: NextFunction) => {}
export const createTodo: RequestHandler = (req, res, next) => {
    const text = (req.body as {text: string}).text;
    const newTodo = new Todo(Math.random().toString(), text);

    TODOS.push(newTodo);

    res.status(201);
    res.json({
        message: "TODOを作成しました。",
        createTodo: newTodo
    })
}

export const getTodos: RequestHandler = (req, res, next) => {
    res.json({todos: TODOS});
}

export const updateTodos: RequestHandler<{id: string}> = (req, res, next) => {
    // 下記のままだとコード補間が効かない
    // そこれ関数定義の部分に、Genericsを定義する
    // <{id: string}>
    const todoId = req.params.id;
    const updateText = (req.body as {text: string}).text;

    const todoIndex = TODOS.findIndex(todo => todo.id === todoId)

    if (todoIndex < 0) {
        throw new Error("対象のTODOがみつかりませんでした")
    }

    TODOS[todoIndex] = new Todo(todoId, updateText);

    res.json({
        message: "更新しました",
        updatedTodo: TODOS[todoIndex]
    })
}

export const deleteTodos: RequestHandler<{id: string}> = (req, res, next) => {
    const todoId = req.params.id;

    const todoIndex = TODOS.findIndex(todo => todo.id === todoId)

    if (todoIndex < 0) {
        throw new Error("対象のTODOがみつかりませんでした")
    }

    TODOS.splice(todoIndex, 1);

    res.json({
        message: "削除しました"
    })
}
