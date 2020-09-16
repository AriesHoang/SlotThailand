var HomeInboxDialogController = HomeBaseController.extend({
    ctor: function () {
        this._super.apply(this, arguments);
        SmartfoxClient.getInstance().addExtensionListener("2", this._onGetItems, this);
        SmartfoxClient.getInstance().addExtensionListener("1", this._onDeleteMailSuccess, this);
    },

    _onGetItems: function (cmd, data) {
        var items = data["p"]["1"];
        var res = [];
        for (var i = 0; i < items.length; ++i) {
            var entry = {};
            entry.id = items[i]["0"];
            entry.title = items[i]["1"];
            entry.sender = items[i]["2"];
            entry.receiver = items[i]["3"];
            entry.content = items[i]["4"];
            entry.type = items[i]["5"];
            entry.readStatus = items[i]["6"] === 0;
            entry.sentTime = items[i]["7"].substr(0,10); // take date only

            res.push(entry);
        }
        this._view.pushItems(res);
    },

    _onDeleteMailSuccess :function (cmd, data) {
        data = data["p"]["1"];
        if (data.length){
            this._view.showDeleteSuccess(data);
        }
    },

    sendGetItemRequest: function (skip, quantity) {

        skip = skip || 0;
        quantity = quantity || 10;
        var sendObj = {
            1: skip,
            2: quantity
        };
        // cc.log("sendGetItemRequest: " + JSON.stringify(sendObj));
        // SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("2", sendObj);
    },

    sendReadMailEvent: function (id) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3",{1:id});
    },

    sendDeleteMailRequest: function (deleteArr) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("1",{1:deleteArr});
    }
});