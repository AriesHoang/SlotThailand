var SlotZodiac = SlotZodiac || {};

(function () {
    var socket = SlotZodiac.socket || {};

    socket.SFSSocket = socket.SFSSocket || {};
    socket.SFSSocket.NotConnection = 0;
    socket.SFSSocket.Connecting = 1;
    socket.SFSSocket.Connected = 2;
    socket.SFSSocket.ConnectFailure = 3;
    socket.SFSSocket.LostConnection = 4;
    socket.SFSSocket.Closed = 5;

    socket.SFSSocket.StatusName = socket.SFSSocket.StatusName || {};
    socket.SFSSocket.StatusName[socket.SFSSocket.NotConnection] = "NotConnected";
    socket.SFSSocket.StatusName[socket.SFSSocket.Connecting] = "Connecting";
    socket.SFSSocket.StatusName[socket.SFSSocket.Connected] = "Connected";
    socket.SFSSocket.StatusName[socket.SFSSocket.ConnectFailure] = "ConnectFailure";
    socket.SFSSocket.StatusName[socket.SFSSocket.LostConnection] = "LostConnection";
    socket.SFSSocket.StatusName[socket.SFSSocket.Closed] = "Closed";

    socket.SmartfoxClient = socket.SmartfoxClient || {};

    socket.SmartfoxClient.NotConnection = socket.SFSSocket.NotConnection;
    socket.SmartfoxClient.Connecting = socket.SFSSocket.Connecting;
    socket.SmartfoxClient.Connected = socket.SFSSocket.Connected;
    socket.SmartfoxClient.ConnectFailure = socket.SFSSocket.ConnectFailure;
    socket.SmartfoxClient.LostConnection = socket.SFSSocket.LostConnection;
    socket.SmartfoxClient.Closed = socket.SFSSocket.Closed;

    socket.SmartfoxClient.Handshake = 0;
    socket.SmartfoxClient.Login = 1;
    socket.SmartfoxClient.Logout = 2;
    socket.SmartfoxClient.GetRoomList = 3;
    socket.SmartfoxClient.JoinRoom = 4;
    socket.SmartfoxClient.AutoJoin = 5;
    socket.SmartfoxClient.CreateRoom = 6;
    socket.SmartfoxClient.GenericMessage = 7;
    socket.SmartfoxClient.ChangeRoomName = 8;
    socket.SmartfoxClient.ChangeRoomPassword = 9;
    socket.SmartfoxClient.ObjectMessage = 10;
    socket.SmartfoxClient.SetRoomVariables = 11;
    socket.SmartfoxClient.SetUserVariables = 12;
    socket.SmartfoxClient.CallExtension = 13;
    socket.SmartfoxClient.LeaveRoom = 14;
    socket.SmartfoxClient.SubscribeRoomGroup = 15;
    socket.SmartfoxClient.UnsubscribeRoomGroup = 16;
    socket.SmartfoxClient.SpectatorToPlayer = 17;
    socket.SmartfoxClient.PlayerToSpectator = 18;
    socket.SmartfoxClient.ChangeRoomCapacity = 19;
    socket.SmartfoxClient.PublicMessage = 20;
    socket.SmartfoxClient.PrivateMessage = 21;
    socket.SmartfoxClient.ModeratorMessage = 22;
    socket.SmartfoxClient.AdminMessage = 23;
    socket.SmartfoxClient.KickUser = 24;
    socket.SmartfoxClient.BanUser = 25;
    socket.SmartfoxClient.ManualDisconnection = 26;
    socket.SmartfoxClient.FindRooms = 27;
    socket.SmartfoxClient.FindUsers = 28;
    socket.SmartfoxClient.PingPong = 29;
    socket.SmartfoxClient.SetUserPosition = 30;
//--- Buddy List API Requests -------------------------------------------------
    socket.SmartfoxClient.InitBuddyList = 200;
    socket.SmartfoxClient.AddBuddy = 201;
    socket.SmartfoxClient.BlockBuddy = 202;
    socket.SmartfoxClient.RemoveBuddy = 203;
    socket.SmartfoxClient.SetBuddyVariables = 204;
    socket.SmartfoxClient.GoOnline = 205;
//--- Game API Requests --------------------------------------------------------
    socket.SmartfoxClient.InviteUser = 300;
    socket.SmartfoxClient.InvitationReply = 301;
    socket.SmartfoxClient.CreateSFSGame = 302;
    socket.SmartfoxClient.QuickJoinGame = 303;
//only reponse code
    socket.SmartfoxClient.UserEnterRoom = 1000,
        socket.SmartfoxClient.UserCountChange = 1001;
    socket.SmartfoxClient.UserLost  = 1002;
    socket.SmartfoxClient.RoomLost = 1003;
    socket.SmartfoxClient.UserExitRoom = 1004;
    socket.SmartfoxClient.ClientDisconnection = 1005;
    socket.SmartfoxClient.ReconnectionFailure = 1006;
    socket.SmartfoxClient.SetMMOItemVariables = 1007;

    socket.SmartfoxClient.SocketStatus = 3000;

    SlotZodiac.socket = socket;
})();
