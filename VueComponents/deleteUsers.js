
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
            <div class='modal-dialog modal-xl' role='document' style='max-width:90%'>\
                <div class='modal-content'>\
                    <div class='modal-header'>\
                        <h5 class='modal-title' id='deleteModalLabel'>Delete Users <a target='_blank' :href='websiteLink'></a></h5>\
                        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>\
                        <span aria-hidden='true'>&times;</span>\
                        </button>\
                    </div>\
                    <div class='modal-body'>\
                        <table class='table'>\
                            <thead>\
                                <tr>\
                                    <th scope='col'></th>\
                                    <th scope='col'><a href='#' class='tableHeader' @click.prevent='sortBy(\"email\")'>Email</a></th>\
                                    <th scope='col'><a href='#' class='tableHeader' @click.prevent='sortBy(\"userId\")'>UserId</a></th>\
                                    <th scope='col'><a href='#' class='tableHeader' @click.prevent='sortBy(\"connection\")'>Connection</a></th>\
                                    <th scope='col'><a href='#' class='tableHeader' @click.prevent='sortBy(\"created_at\")'>Created</a></th>\
                                    <th scope='col'><a href='#' class='tableHeader' @click.prevent='sortBy(\"last_login\")'>Last Login</a></th>\
                                </tr>\
                            </thead>\
                            <tbody>\
                            <tr v-for='option in userList'>\
                                <td><input style='width: 2em; height: 2em;' type='checkbox' v-model='option.checked'></input></td>\
                                <td>{{option.email}}</td>\
                                <td><a href='#' @click.prevent='copyToClipboard(\"User ID\", option.userId)'><strong style=''>{{option.userId}}</strong></a><a target='_blank' :href='option.websiteLink'></a></td>\
                                <td>{{option.connection}}</td>\
                                <td>{{option.created_at}}</td>\
                                <td>{{option.last_login}}</td>\
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
            apiToken: '',
            websiteLink: '',
            sortVal: '',
            ascending: false
        }
    },
    methods: {
        sortBy(val){
            if (this.sortVal === val){
                this.ascending = !this.ascending;
            } else {
                this.sortVal = val;
                this.ascending = false;
            }
            var orderVal = this.ascending ? 'asc' : 'desc'
            this.userList.sort(compareValues(this.sortVal, orderVal));
        },
        getDomainLink(){
            var domainSplit = this.domain.split(".");
            this.websiteLink = "https://manage.auth0.com/dashboard/" + domainSplit[1] + "/" + domainSplit[0] + "/users";
        },
        copyToClipboard(copyText, text){
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(text).select();
            document.execCommand("copy");
            $temp.remove();

            bus.$emit('show-toast', copyText)
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
                var user = { "email": element.email ?? "" , "userId": element.user_id, "created_at": element.created_at, "last_login":element.last_login, "connection": element.identities[0].connection, "websiteLink": this.websiteLink + "/" + btoa(element.user_id)};
                users.push(user)
            });
            this.userList = users;
            this.sortBy('connection');
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
         this.getDomainLink();
    },
    mounted(){
      
    }
})



