const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader")

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure())

const text = process.argv[2]
client.createTodo({
    "id": -1,
    "text": text
}, (err, response) => {
    if (err) {
        console.error("Error creating todo:", err);
    } else {
        console.log("Received from server:", JSON.stringify(response));
    }
})


client.readTodos({}, (err, response) => {
    if (err) {
        if (!response.items)
            console.error("Error creating todo: ", err);
    } else {
        // console.log("Received from server:", JSON.stringify(response));
        console.log("ReadTodos from server");
        response.items.map((item) => { console.log("Received from server: ", JSON.stringify(item)) })
        console.log('---------------')
    }
});

const call = client.readTodosStream()

call.on("data", item => {
    console.log("Received item from server stream " + JSON.stringify(item))
})

call.on("end", e => console.log("Server done!"))