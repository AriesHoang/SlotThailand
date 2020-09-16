var HomeChatDialogController = HomeBaseController.extend({
    ctor: function () {
        this._super.apply(this, arguments);

        SmartfoxClient.getInstance().addExtensionListener("26", this._onFetchChatChannel, this);
        SmartfoxClient.getInstance().addExtensionListener("21", this._onFetchChatMessages, this);
        SmartfoxClient.getInstance().addExtensionListener("20", this._onMessageReceived, this);
    },

    _onFetchChatChannel: function (cmd, data) {
        data = data["p"]["1"];
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var entry = {
                id: data[i]["0"],
                name: data[i]["1"],
                type: data[i]["2"],
                memberList: data[i]["3"],
                createdTime: data[i]["4"],
                avatarUrl: data[i]["5"]
            };
            res.push(entry);
        }

        this._view.initChannelList(res);
    },

    _onFetchChatMessages: function (cmd, data) {
        data = data["p"];
        var res = {};
        res.channelId = data["1"];
        res.messages = [];
        for (var i = 0; i < data["2"].length; i++) {
            var messData = data["2"][data["2"].length - i - 1];
            var message = this.parseMessageObj(messData);
            res.messages.push(message);
        }
        this.selectedGroup = res.channelId;
        this._view.setChatListItems(res);
    },

    _onMessageReceived: function (cmd, data) {
        data = data["p"];
        var message = this.parseMessageObj(data);
        this._view.pushNewMessage(message, true);
    },

    parseMessageObj: function (data) {
        return {
            id: data["0"],
            groupId: data["1"],
            sender: data["2"],
            content: data["3"],
            sentTime: data["4"],
            userType: data["5"]
        };
    },

    sendFetchChatChannel: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("27", null);
    },

    sendFetchChannelMessages: function (channelId, lastMessageId) {
        var sendObj = {
            "1": channelId,
            "2": ""
        };
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("21", sendObj);
    },

    sendMessageToChannel: function (channelId, message) {
        var sendObj = {
            1: channelId,
            2: message,
            3: PlayerMe.userType
        };
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("20", sendObj);
    },

    sendSubscribeToChannel: function (channelId) {
        var sendObj = {
            1: [channelId],
            2: []
        };
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("24", sendObj);
    },

    sendUnsubscribeToChannel: function (channelId) {
        var sendObj = {
            1: [channelId],
            2: []
        };
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("25", sendObj);
    }
});