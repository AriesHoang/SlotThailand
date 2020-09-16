String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var HomeChatDialog = BackButtonDialog.extend({
    ctor: function () {
        this._super();

        var bg = new cc.Sprite("#home_dialog_bg_blank.png");
        this.addChild(bg);
        this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);
        this._currentChatChannel = null;
        this._allChannel = [];
        this._channelMessages = {};

        this._initLabels();
        this._initGUIs();

        this.initController();
        this._controller.sendFetchChatChannel();
        this._initChatList();

        this.mapNotiyItem = {};
        this.setLoading(true);
    },

    _initLabels: function () {
        var title = MultiLanguage.createLabelTTFFont("CHAT_TITLE", cc.res.font.Myriad_Pro_Regular, 64);
        title.enableStroke(cc.color("#00d8ff"), 2);
        title.setPosition(0, 197);
        this.addChild(title);

        var label1 = MultiLanguage.createLabelTTFFont("CHAT_DESCRIPTION", cc.res.font.Myriad_Pro_Bold, 30);
        label1.enableStroke(cc.color("#ff9600"), 1);
        label1.setFontFillColor(cc.color("#fbff8e"));
        label1.setPosition(0, 277);
        this.addChild(label1);
    },

    _initGUIs: function () {
        var searchBar = new ccui.Scale9Sprite("home_dialog_chat_bar.png", cc.rect(20, 0, 2, 35));
        searchBar.setPreferredSize(cc.size(252, 38));
        searchBar.setPosition(-409, 140);
        this.addChild(searchBar);


        var searchTF = new MultiLanguage.createNewUITextField("FIND_CHANEL", cc.size(225, 48),
            cc.res.font.Myriad_Pro_Regular, 27, cc.res.font.Myriad_Pro_Regular, 27);
        searchTF.setTextColor(cc.color(0, 0, 0, 204));
        searchTF.setAlignment(1);
        searchTF.setPlaceHolderColor(cc.color(0, 0, 0, 204));

        searchTF.setPosition(-409, 138);
        this.addChild(searchTF);
        this.searchTF = searchTF;

        var searchBtn = new ccui.Button("home_dialog_btn_search.png", "", "", ccui.Widget.PLIST_TEXTURE);
        searchBtn.setPosition(-249, 139);
        this.addChild(searchBtn);

        var chatBar = new ccui.Scale9Sprite("home_dialog_chat_bar.png", cc.rect(20, 0, 2, 35));
        chatBar.setPreferredSize(cc.size(691, 35));
        chatBar.setPosition(133, -205);
        this.addChild(chatBar);

        var chatTF = new MultiLanguage.createNewUITextField("CHAT_HINT", cc.size(775, 48), cc.res.font.Myriad_Pro_Regular, 25, cc.res.font.Myriad_Pro_Regular, 25);
        chatTF.setTextColor(cc.color(0, 0, 0, 204));
        chatTF.setAlignment(1);
        chatTF.setPlaceHolderColor(cc.color(0, 0, 0, 204));

        chatTF.setPosition(190, -208);
        this.addChild(chatTF);
        this.chatTF = chatTF;

        var sendBtn = new ccui.Button("home_dialog_btn_send.png", "", "", ccui.Widget.PLIST_TEXTURE);
        sendBtn.setPosition(511, -205);
        this.addChild(sendBtn);

        var thiz = this;
        searchBtn.addClickEventListener(function () {
            thiz._searchBtnHandler();
        });

        sendBtn.addClickEventListener(function () {
            thiz._sendBtnHandler();
        })
    },

    initController: function () {
        this._controller = new HomeChatDialogController(this);
    },

    initChannelList: function (itemData) {
        this._allChannel = [];
        this.channelList && this.channelList.removeAllItems();

        if (!this.channelList) {
            var channelBg = new ccui.Scale9Sprite("home_dialog_chat_border.png", cc.rect(30, 30, 2, 2));
            channelBg.setPreferredSize(cc.size(315, 290));
            channelBg.setPosition(-378, -31);
            this.addChild(channelBg);

            var channelList = new newui.TableView(cc.size(285, 259), 1);
            channelList.setDirection(ccui.ScrollView.DIR_VERTICAL);
            channelList.setScrollBarEnabled(false);
            channelList.setTouchEnabled(true);
            channelList.setBounceEnabled(true);
            channelList.setAnchorPoint(cc.p(0.5, 0.5));
            channelList.setPosition(-375, -36);
            this.addChild(channelList, 1);

            this.channelList = channelList;
        }

        for (var i = 0; i < itemData.length; i++) {
            var channelEntry = this._createChannelEntry(itemData[i]);
            // channelEntry.setRead(true);
            channelEntry.id = itemData[i].id;
            this.channelList.pushItem(channelEntry);
            this._allChannel.push(channelEntry);
        }

        if (this._allChannel.length)
            this.setSelectedChatChannel(this._allChannel[0]);

        this.saveChanel = itemData;

    },

    setSelectedChatChannel: function (channelEntry) {
        if (this._currentChatChannel === channelEntry)
            return;

        if (this._currentChatChannel) {
            this._currentChatChannel.setChannelSelected(false);
            this._controller.sendUnsubscribeToChannel(this._currentChatChannel.channelEntry.id);
        }
        this._currentChatChannel = channelEntry;
        channelEntry.setChannelSelected(true);
        var channelMessages = this._channelMessages[channelEntry.id + ""];
        var lastMessageId = channelMessages && channelMessages.length ?
            channelMessages[channelMessages.length - 1].id : null;
        this._controller.sendFetchChannelMessages(channelEntry.id, lastMessageId);
        this._controller.sendSubscribeToChannel(this._currentChatChannel.channelEntry.id);


        if (this.mapNotiyItem) {
            this.mapNotiyItem[channelEntry.id].setRead(false);
        }
    },

    _createChannelEntry: function (channelData) {
        var thiz = this;
        var res = new cc.Node();
        res.channelEntry = channelData;
        var size = cc.size(277, 39);
        var channelSelectedBorder = new ccui.Scale9Sprite("home_dialog_channel_selected_border.png", cc.rect(5, 5, 2, 2));
        channelSelectedBorder.setPreferredSize(size);
        res.setContentSize(size);
        channelSelectedBorder.setPosition(res.width / 2, res.height / 2);
        channelSelectedBorder.setVisible(false);
        res.addChild(channelSelectedBorder);
        res.channelSelectedBorder = channelSelectedBorder;

        var channelLabel = new cc.LabelTTF(channelData.name, cc.res.font.Myriad_Pro_Regular, 27);
        channelLabel.setAnchorPoint(cc.p(0, 0.5));
        channelLabel.setPosition(30, res.height / 2);
        res.addChild(channelLabel);

        var readBtn = new ccui.Widget();
        readBtn.setContentSize(cc.size(175, res.height - 14));
        readBtn.setAnchorPoint(cc.p(0, 0.5));
        readBtn.setPosition(30, res.height / 2);
        readBtn.setTouchEnabled(true);
        res.addChild(readBtn);

        readBtn.addClickEventListener(function () {
            thiz.setSelectedChatChannel(res);
        });

        var readIndicator = new cc.Sprite("#home_dialog_read_channel_indicator.png");
        readIndicator.setPosition(256, 20);
        readIndicator.setVisible(false);
        res.addChild(readIndicator);
        res.readIndicator = readIndicator;


        res.setChannelSelected = (function (isSelected) {
            this.channelSelectedBorder.visible = isSelected
        }).bind(res);

        res.setRead = (function (isRead) {
            this.readIndicator.visible = isRead;
        }).bind(res);

        this.mapNotiyItem[channelData.id] = res;

        return res;
    },

    _initChatList: function () {
        var chatBg = new ccui.Scale9Sprite("home_dialog_chat_border.png", cc.rect(30, 30, 2, 2));
        chatBg.setPreferredSize(cc.size(752, 331));
        chatBg.setPosition(163, -5);
        this.addChild(chatBg);

        var chatList = new newui.TableView(cc.size(732, 311), 1);
        chatList.setAnchorPoint(cc.p(0.5, 0.5));
        chatList.setPosition(163, -5);
        chatList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        chatList.setBounceEnabled(true);
        chatList.setScrollBarEnabled(false);
        this.addChild(chatList, 1);

        this.chatList = chatList;
    },

    setChatListItems: function (result) {
        if (!this._channelMessages[result.channelId + ""])
            this._channelMessages[result.channelId + ""] = result.messages;

        this.chatList.removeAllItems();
        this.allChatLabel = [];
        for (var i = 0; i < result.messages.length; i++) {
            this.pushNewMessage(result.messages[i]);
        }
        this._filterChatMessage();
        this.setLoading(false);
    },

    _filterChatMessage: function () {
        if (cc.Global.arrBadWord && this.allChatLabel && this.allChatLabel.length) {
            for (var i = 0; i < this.allChatLabel.length; i++) {
                this._filterMessage(this.allChatLabel[i]);
            }
        }
    },

    _filterMessage: function (label) {
        var text = label.getString() || "";
        var arr = cc.Global.arrBadWord;
        if (!arr || arr.length )
        for (var i = 0; i < arr.length; i++) {
            if (text.toLowerCase().indexOf(arr[i].toLowerCase()) !== -1) {
                text = text.replaceAll(arr[i], '***');
                label.setString(text);
            }
        }
    },
    pushNewMessage: function (message, filter) {
        var userTypeColor = ["#ffffff", "#ffd800", "#00ff18", "#ff0000"];
        var messLabel = new cc.LabelTTF(message.sender + " : " + message.content,
            cc.res.font.Myriad_Pro_Regular, 25, cc.size(700, 0), cc.TEXT_ALIGNMENT_LEFT, cc.TEXT_ALIGNMENT_CENTER);
        messLabel.setFontFillColor(cc.color(userTypeColor[message.userType]));
        messLabel.enableStroke(cc.color("#ffffff"), message.userType === 3 ? 2 : 0);
        this.chatList.pushItem(messLabel);

        filter && this._filterMessage(messLabel);
        this.allChatLabel.push(messLabel);
        this.chatList.scrollToBottom(0.5, false);

        if (filter && this.mapNotiyItem) {
            if (message.sender !== PlayerMe.username){
                this.mapNotiyItem[message.groupId].setRead(true);
                SoundPlayer.playSound("thong-bao-mail-chat-pm");
            }
        }
    },

    _searchBtnHandler: function () {
        var chanel = this.searchTF.getText();
        this._allChannel = [];
        this.channelList && this.channelList.removeAllItems();

        for (var i = 0; i < this.saveChanel.length; i++) {
            if (this.saveChanel[i].name.toLowerCase().indexOf(chanel.toLowerCase()) !== -1) {
                var channelEntry = this._createChannelEntry(this.saveChanel[i]);
                channelEntry.id = this.saveChanel[i].id;
                this.channelList.pushItem(channelEntry);
                this._allChannel.push(channelEntry);
            }
            if (this._allChannel.length)
                this.setSelectedChatChannel(this._allChannel[0]);
        }
    },
    _sendBtnHandler: function () {
        var str = this.chatTF.getText();
        if(str!=""){
            this._controller.sendMessageToChannel(this._currentChatChannel.channelEntry.id, str);
            this.chatTF.setText("");
        }
    }
});