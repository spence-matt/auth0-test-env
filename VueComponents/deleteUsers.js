
Vue.component('delete-users', {
    props: [
        'accessToken',
        'apiClientId',
        'apiClientSecret',
        'domain'
    ],
    template: "\
    <span id='deleteUserModal'>\
        <button type='button' @click.prevent='getUserList' class='btn btn-danger btn-sm' data-toggle='modal' data-target='#deleteModal'>Delete Accounts</button>\
        <div class='modal fade' id='deleteModal' tabindex='-1' role='dialog' aria-labelledby='deleteModalLabel' aria-hidden='true'>\
            <div class='modal-dialog modal-xl' role='document'>\
                <div class='modal-content'>\
                    <div class='modal-header'>\
                        <h5 class='modal-title' id='deleteModalLabel'>Delete Users</h5>\
                        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>\
                        <span aria-hidden='true'>&times;</span>\
                        </button>\
                    </div>\
                    <div class='modal-body'>\
                        <table class='table'>\
                            <thead>\
                                <tr>\
                                    <th scope='col'></th>\
                                    <th scope='col'>Email</th>\
                                    <th scope='col'>UserID</th>\
                                    <th scope='col'>Connection</th>\
                                    <th scope='col'>Created</th>\
                                </tr>\
                            </thead>\
                            <tbody>\
                            <tr v-for='option in userList'>\
                                <td><input type='checkbox' v-model='option.checked'></input></td>\
                                <td>{{option.email}}</td>\
                                <td><a href='#' @click.prevent='copyToClipboard(\"User ID\", option.userId)'><strong style=''>{{option.userId}}</strong></a></td>\
                                <td>{{option.connection}}</td>\
                                <td>{{option.created_at}}</td>\
                            </tr>\
                            </tbody>\
                        </table>\
                    </div>\
                    <div class='modal-footer'>\
                        <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>\
                        <button type='button'  @click.prevent='deleteUsers()' data-dismiss='modal' class='btn btn-danger'>Delete Accounts</button>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </span>\
    ",
    data: function(){
        return{
            userList:[],
            deleteUserList:[],
            apiToken: ''
        }
    },
    methods: {
        copyToClipboard(copyText, text){
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(text).select();
            console.log(document.execCommand("copy"));
            document.execCommand("copy");
            $temp.remove();
            this.copyText = copyText + ' Copied to Clipboard';
            // $('.toast').toast('show');
            // console.log(text);
        },
        getUserList(){
            var setUserList = this.setUserList;
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://" + this.domain + "/api/v2/users?sort=created_at%3A-1",
                "method": "GET",
                "headers": {
                    "authorization": "Bearer " + this.apiToken,
                    "content-type": "application/json"
                }
              }
              
              $.ajax(settings).done(function (response) {
                //   console.log(response);
                setUserList(response);
              });
        },
        deleteUsers (){
            this.userList.forEach(element => {
                if (element.checked){
                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": "https://" + this.domain + "/api/v2/users/" + element.userId,
                        "method": "DELETE",
                        "headers": {
                            "authorization": "Bearer " + this.apiToken,
                            "content-type": "application/json"
                        }
                    }
                      
                    $.ajax(settings).done(function (response) {

                    });
                }
            });
        },
        setUserList(val){
            var users = [];
            val.forEach(element => {
                var user = { "email": element.email, "userId": element.user_id, "created_at": element.created_at, "connection": element.identities[0].connection};
                users.push(user)
            });
    
            this.userList = users;
        },
        getAPIToken (){
            var copyToClipboard = this.copyToClipboard;
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://" + this.domain + "/oauth/token",
                "method": "POST",
                "headers": {
                  "content-type": "application/json"
                },
                "data": "{\"client_id\":\"" + this.apiClientId + "\",\"client_secret\":\"" + this.apiClientSecret + "\",\"audience\":\"https://" + this.domain + "/api/v2/\",\"grant_type\":\"client_credentials\"}"
              }
              
              $.ajax(settings).done(function (response) {
                copyToClipboard("API Access Token", response.access_token);
              });
        },
        setApiVal (val){
            this.apiToken = val;
        }
    },
    created(){
        var setApiVal = this.setApiVal;
        bus.$on('set-api-token', function(info) {
            setApiVal(info);
         })
         $.fn.modal.Constructor.prototype._enforceFocus = function() {};

    },
    mounted(){
      
    }
})



