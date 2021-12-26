
const { ddbClient } = require('./ddbclient');
const { QueryCommand,
    PutItemCommand,
    GetItemCommand,
    ScanCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

class TodoService {

    constructor(tableName) {
        this.TABLENAME = tableName
    }

    // addTodo(todo) {
    //     let params = {
    //         TableName: this.TABLENAME,
    //         Item: {
    //             Email: { 'S': todo.Email }, //PK
    //             Id: { 'S': todo.Id },  //SK
    //             Title: { 'S': todo.Title},
    //             IsCompleted: { 'BOOL': todo.IsCompleted }
    //         }
    //     }
    //     return ddbClient.send(new PutItemCommand(params))
    // }

    addTodo(todo) {
        let params = {
            TableName: this.TABLENAME,
            Item: marshall(todo)
        }
        return ddbClient.send(new PutItemCommand(params))

    }

    async getTodosByEmail(email) {
        var params = {
            TableName: this.TABLENAME,
            KeyConditionExpression: "Email = :email",
            ExpressionAttributeValues: {
                ":email": { 'S': email }
            }
        };
        let result = await ddbClient.send(new QueryCommand(params))
            .catch(err => Promise.reject(err));
        let todos= [];
        result.Items.forEach((item)=> todos.push(unmarshall(item)));
        return Promise.resolve(todos)
    }

    async getTodo(email, id) {
        var params = {
            TableName: this.TABLENAME,
            Key: marshall({
                Email: email,
                Id: id
            })
        };
        let result = await ddbClient.send(new GetItemCommand(params))
            .catch(err => Promise.reject(err));
        return Promise.resolve(unmarshall(result.Item))
    }

    async getAll() {
        let params = {
            TableName: this.TABLENAME,
        }
        let result = await ddbClient.send(new ScanCommand(params))
            .catch(err => Promise.reject(err));
        let todos = [];
        result.Items.forEach((item) => todos.push(unmarshall(item)));
        return Promise.resolve(todos)
    }
}

module.exports = { TodoService }