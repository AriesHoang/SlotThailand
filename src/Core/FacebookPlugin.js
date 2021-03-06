/**
 * Created by QuyetNguyen on 11/9/2016.
 */
var FacebookPlugin = (function() {
    var instance = null;
    var Clazz = cc.Class.extend({
        plugin: null,
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {

            }
        },
        showLogin : function () {
            var thiz = this;
            FB.login(function(response){
                cc.log(response);
                if(response && response["status"] && response["status"] === "connected"){
                    thiz.onLoginFinished(0, response["authResponse"]["userID"], response["authResponse"]["accessToken"]);
                }
                else{
                    thiz.onLoginFinished(1, "", "");
                }
            });
        },

        onLoginFinished : function (returnCode, userId, accessToken) {
            //cc.log(returnCode + " " + userId + " "+ accessToken);
        }
    });

    Clazz.getInstance = function() {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    };
    return Clazz;
})();