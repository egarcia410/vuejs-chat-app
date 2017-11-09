let socket = io();

new Vue({
    el: '#app',
    data: {
        connectedUsers: [],
        messages: [],
        message: {
            'type': '',
            'user': '',
            'text': '',
            'timestamp': ''
        },
        areTyping: []
    },
    created() {
        socket.on('user joined', (socketId) => {
            axios.get('/onlineUsers')
                .then((res) => {
                    for (var key in res.data) {
                        if (this.connectedUsers.indexOf(key) <= -1) {
                            this.connectedUsers.push(key);
                        }
                    }
                }).catch((error) => {
                    console.log(error);
                });
        });

        socket.on('chat.message', (message) => {
            this.messages.push(message);
        });

        socket.on('user left', (socketId) => {
            let index = this.connectedUsers.indexOf(socketId);
            if (index >= 0) {
                this.connectedUsers.splice(index, 1);
            }
        });
    },
    methods: {
        send: function() {
            this.message.type = 'chat';
            this.message.user = socket.id;
            this.message.timestamp = moment().calendar();
            socket.emit('chat.message', this.message);
            this.message.type = '';
            this.message.user = '';
            this.message.text = '';
            this.message.timestamp = '';
        },
        userIsTyping: function (username) {
            if (this.areTyping.indexOf(username) >= 0) {
                return true;
            }
            return false;
        },
        usersAreTyping: function () {
            if (this.areTyping.indexOf(socket.id) <= -1) {
                this.areTyping.push(socket.id);
                socket.emit('user typing', socket.id);
            }
        },
        stoppedTyping: function (keycode) {
            if (keycode === '13') {
                let index = this.areTyping.indexOf(socket.id);
                if (index >= 0) {
                    this.areTyping.splice(index, 1);
                }
            }
        }
    }
})