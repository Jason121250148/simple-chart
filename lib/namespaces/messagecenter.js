const io = require("../io");

const users = [
    {
        name: "王经理"
    },
    {
        name: "李博士"
    },
    {
        name: "刘副部"
    },
    {
        name: "张处长"
    },
    {
        name: "林所长"
    },
];

const rooms = ["群聊1", "群聊2", "群聊3", "群聊4"];

const messageCenter = io.of("/message-enter");
messageCenter.on("connection", function(socket){
    let room = null;
    socket.on("login", function(userName){
        const user = users.find(item => item.name === userName);
        if (user)
        {
            const roomName = getPrivateRoomName(user.name);
            socket.join(roomName);
        }
    });
    socket.emit("init", {
        users,
        rooms
    });
    socket.on("send message", function(info){
        if (info.privateChart)
        {
            const fromUserName = info.fromUserName;
            const toUserName = info.toUserName;
            const message = info.message;
            let fromUser = null;
            let toUser = null;
            for(let user of users)
            {
                if (user.name === fromUserName)
                {
                    fromUser = user;
                }
                if (user.name === toUserName)
                {
                    toUser = user;
                }
            }
            if (!fromUser || !toUser)
            {
                throw new Error("The receiver or sender is null.");
            }
            const roomName = getPrivateRoomName(toUser.name);
            socket.to(roomName).emit('show message', `${fromUserName}: ${message}`);
        }
    });

    socket.on("room change", function(roomName){
        if (room)
        {
            socket.leave(room);
        }
        room = roomName;
        socket.join(room);
    });

    socket.on('send group message', function(info){
        messageCenter.to(room).emit('show group message', `${info.fromUserName}: ${info.message}`);
    });
});

function getPrivateRoomName(userName)
{
    return "privateRoom-" + userName;
}
