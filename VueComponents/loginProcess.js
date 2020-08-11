var DOMAIN = '';
var CUSTOMDOMAIN = '';
var CLIENT_ID = '';
var AUDIENCE = '';
var SCOPE = '';
var RESPONSE_TYPE = '';
var CONNECTION = '';
var PROMPT = '';

var APICLIENTID = '';
var APICLIENTSECRET = '';

const logs = document.querySelector('#logs')


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

Vue.component('login-process', {
    props: [
        'normalDomain', 
        'customDomain', 
        'clientId', 
        'promptAudience', 
        'scope', 
        'promptConnection', 
        'smsLogin',
        'passwordlessLogin',
        'prompt',
        'apiClientSecret',
        'apiClientId',
        'passwordless'
    ],
    template: "\
    <div>\
    <div><a href='#' @click.prevent='copyToClipboard(\"Domain\", domain)'><strong style='font-size:20px'></strong>Domain:</a> {{domain}} &nbsp;<a target='_blank' :href='websiteLink'>Dashboard</a>&nbsp;&nbsp;&nbsp;<a target='_blank' :href='websiteLink + \"/login_settings\"'>Lock</a>&nbsp;&nbsp;&nbsp;<a target='_blank' :href='inspectorLink'>Inspector</a>&nbsp;&nbsp;&nbsp;<a target='_blank' :href='realtimeExtension'>Realtime Extension</a></div>\
    <div><a href='#' @click.prevent='copyToClipboard(\"Client ID\", clientId)'><strong style='font-size:20px'></strong>Client ID: </a> {{clientId}}&nbsp;<a target='_blank' :href=\"websiteLink + '/applications/'+ clientId + '/settings' \">App Settings</a></div>\
    <div> <a href='#' @click.prevent='copyToClipboard(\"Audience\", audience)'><strong style='font-size:20px'></strong> Audience: </a> {{audience}} <a href='#' @click.prevent='editAudience' data-toggle='modal' data-target='#audienceModal'>(Edit)</a></div>\
    <div>Connection: {{connection}} <a href='#' @click.prevent='editConnection' data-toggle='modal' data-target='#connectionModal'>(Edit)</a><a href='#' v-if='connection' @click.prevent='clearConnection'>(Clear)</a></div>\
    <div><a target='_blank' :href=\"websiteLink + '/mfa/'\">MFA</a></div>\
    </br>\
    <button type='button' class='btn btn-dark btn-sm' @click.prevent='login'>Login</button>\
    <button v-if='smsLogin' type='button' class='btn btn-dark btn-sm' @click.prevent='loginViaSMS'>Login SMS</button>\
    <button v-if='passwordlessLogin' type='button' class='btn btn-dark btn-sm' @click.prevent='loginPasswordless'>Login Passwordless</button>\
    <button type='button' class='btn btn-dark btn-sm' @click.prevent='silentLogin'>Silent Login</button>\
    <button type='button' class='btn btn-dark btn-sm' @click.prevent='logout'>Logout</button>\
    <button type='button' class='btn btn-dark btn-sm' @click.prevent='logoutFederated'>Logout Federated</button>\
    <br>\
    <br>\
    <button type='button' class='btn btn-info btn-sm' @click.prevent='copyToClipboard(\"API Access Token\", apiToken)'>Get API Token</button>\
    </br>\
    </br>\
        <div  v-if='error == \"Loading...\"' class='alert alert-warning' role='alert'>\
            {{error}}\
        </div>\
        <div v-else-if='error' class='alert alert-danger' role='alert'>\
            <pre style='margin-bottom:0px;'>{{error}}</pre>\
        </div>\
        <div v-if='values'>\
            <div class='row'>\
                <div class='col-lg-6'>\
                    <a href='#' @click.prevent='copyToClipboard(\"Access Token Payload\", accessTokenPayload)'><strong style='font-size:20px'>Access Token Payload:</strong></a>\
                    <br/>\
                    <pre>{{accessTokenPayload}}</pre>\
                </div>\
                <div class='col-lg-6'>\
                    <a href='#' @click.prevent='copyToClipboard(\"Access Token\", accessToken)'><strong style='font-size:20px'>Access Token:</strong></a>\
                    &nbsp;&nbsp&nbsp\
                    <a target='_blank' :href=\"'https://jwt.io/#debugger-io?token=' + accessToken\">jwt.io</a>\
                    <br/>\
                    <code>{{accessToken}}</code>\
                </div>\
            </div>\
            <hr/>\
            <div class='row'>\
                <div class='col-lg-6'>\
                    <a href='#' @click.prevent='copyToClipboard(\"ID Token Payload\", idTokenPayload)'><strong style='font-size:20px'>ID Token Payload:</strong></a>\
                    <br/>\
                    <pre>{{idTokenPayload}}</pre>\
                </div>\
                <div class='col-lg-6'>\
                    <a href='#' @click.prevent='copyToClipboard(\"ID Token\", idToken)'><strong style='font-size:20px'>ID Token:</strong></a>\
                    &nbsp;&nbsp&nbsp\
                    <a target='_blank' :href=\"'https://jwt.io/#debugger-io?token=' + idToken\">jwt.io</a>\                <br/>\
                    <code>{{idToken}}</code>\
                </div>\
            </div>\
            <hr/>\
            <div class='row'>\
                <div class='col-lg-6'>\
                    <a href='#' @click.prevent='copyToClipboard(\"User Info\", userInfo)'><strong style='font-size:20px'>User Info:</strong></a>\
                    <br/>\
                    <pre>{{userInfo}}</pre>\
                </div>\
            </div>\
        </div>\
        <div class='modal fade' id='audienceModal' tabindex='-1' role='dialog' aria-labelledby='audienceModalLabel' aria-hidden='true'>\
            <div class='modal-dialog' role='document'>\
                <div class='modal-content'>\
                    <div class='modal-header'>\
                        <h5 class='modal-title' id='audienceModalLabel'>Audience</h5>\
                        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>\
                        <span aria-hidden='true'>&times;</span>\
                        </button>\
                    </div>\
                    <div class='modal-body'>\
                        <div class='form-check' v-if='audienceList' v-for='option in audienceList'>\
                            <input class='form-check-input' type='radio' name='exampleRadios' v-bind:value='option' :id='option' v-model='tempAudience' :value='option'>\
                            <label class='form-check-label' :for='option'>\
                                {{option}}\
                            </label>\
                        </div>\
                    </div>\
                    <div class='modal-footer'>\
                        <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>\
                        <button type='button' @click.prevent='saveAudience(tempAudience)' data-dismiss='modal' class='btn btn-primary'>Save changes</button>\
                    </div>\
                </div>\
            </div>\
        </div>\
        <div class='modal fade ' id='connectionModal' tabindex='-1' role='dialog' aria-labelledby='connectionModalLabel' aria-hidden='true'>\
            <div class='modal-dialog modal-xl' role='document'>\
                <div class='modal-content'>\
                    <div class='modal-header'>\
                        <h5 class='modal-title' id='connectionModalLabel'>Connection</h5>\
                        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>\
                        <span aria-hidden='true'>&times;</span>\
                        </button>\
                    </div>\
                    <div class='modal-body'>\
                        <table class='table'>\
                            <thead>\
                                <tr>\
                                    <th scope='col'></th>\
                                    <th scope='col'>Connection</th>\
                                    <th scope='col'>Id</th>\
                                    <th scope='col'>Strategy</th>\
                                    <th scope='col'>Enabled</th>\
                                    <th scope='col' @click='canDeleteConnections = !canDeleteConnections'>Delete</th>\
                                </tr>\
                            </thead>\
                            <tbody>\
                                <tr>\
                                    <td>\
                                        <div class='form-check' >\
                                            <input  class='form-check-input' type='radio' name='exampleRadios' value='' id='AnyConnection' v-model='tempConnection'>\
                                        </div>\
                                    </td>\
                                    <td>N/A</td>\
                                    <td></td>\
                                </tr>\
                                <tr v-if='connectionList' v-for='option in connectionList'>\
                                    <td>\
                                        <div class='form-check' >\
                                            <input class='form-check-input' type='radio' name='exampleRadios' v-bind:value='option' :id='option' v-model='tempConnection' :value='option.name' >\
                                        </div>\
                                    </td>\
                                    <td><a href='#' @click.prevent='copyToClipboard(\"Connection Name\", option.name)'>{{option.name}}</a> <a v-if='option.url' target='_blank' :href='option.url'></a></td>\
                                    <td> <a href='#' @click.prevent='copyToClipboard(\"Connection Id\", option.id)'>{{option.id}}</a></td>\
                                    <td>{{option.strategy}}</td>\
                                    <td>\
                                        <label class='switch' >\
                                            <input type='checkbox' v-on:click='toggleConnectionEnabled(option)' v-model='option.enabled'>\
                                            <span class='slider'></span>\
                                        </label>\
                                    </td>\
                                    <td>\
                                        <button v-if='canDeleteConnections' style='width:80px; margin-bottom:5px;' type='button' class='btn btn-danger btn-sm' @click='deleteConnection(option)'>Delete</button>\
                                    </td>\
                                </tr>\
                            </tbody>\
                        </table>\
                    </div>\
                    <div class='modal-footer'>\
                        <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>\
                        <button type='button' @click.prevent='saveConnection(tempConnection)' data-dismiss='modal' class='btn btn-primary'>Save changes</button>\
                    </div>\
                </div>\
            </div>\
        </div>\
        <div class='centeredParent'>\
            <div class='centered toast'>\
                <div class='toast-body' >\
                    {{copyText}}\
                </div>\
            </div>\
        </div>\
    </div>\
    ",
    data: function(){
        return{
            websiteLink: '',
            inspectorLink: '',
            realtimeExtension: '',
            domain: '',
            audience: '', 
            tempAudience: '',
            audienceList: [],
            connection: '',
            tempConnection: '',
            connectionList: [],
            canDeleteConnections: false,
            apiToken: '',
            accessToken: '', 
            accessTokenPayload: '', 
            idToken: '',
            idTokenPayload: '',
            userInfo: '',
            values: false,
            error: 'Loading...',
            copyText: ''
        }
    },
    methods: {
        login () {
            auth0.authorize({
              prompt: this.prompt,
              scope: this.scope,
              connection: this.connection,
            //   redirectUri: 'http://localhost:3000/basic.php',
              audience: this.audience,
              responseType:RESPONSE_TYPE,
            //   screen_hint:'signup'
            })
        },
        silentLogin () {
            auth0.authorize({
              prompt: 'none',
              scope: this.scope,
              connection: this.connection,
              audience: this.audience,
            })
        },
        loginViaSMS (){
            var lockPasswordless = new Auth0LockPasswordless(this.clientId, this.domain);
            lockPasswordless.show({
                allowedConnections: ['sms']
            });
        },
        loginPasswordless (){
            var options = {
                passwordlessMethod: 'code'
              };
            var lockPasswordless = new Auth0LockPasswordless(this.clientId, this.domain, options);
            lockPasswordless.show({
                // passwordlessMethod: 'link'
            });
        },
        logout () {
            auth0.logout({
                returnTo: URL,
                clientID: CLIENT_ID
            })
        },
        logoutFederated(){
            auth0.logout({
              federated: "true",
              returnTo: URL,
              clientID: CLIENT_ID
            })
        },
        setValues (data) {
            this.values = true;
            this.accessToken = data.accessToken;
            this.childToParent();
            if (data.accessToken && data.accessToken.startsWith('eyJ')) {
                var atp = JSON.parse(atob(data.accessToken.split('.')[1]))
                this.accessTokenPayload = JSON.stringify(atp, 0, 4);
            }
            this.idToken = data.idToken;
            this.idTokenPayload = JSON.stringify(data.idTokenPayload, 0, 4);

            this.error = '';
        },
        setUserInfo (data) {
            this.userInfo = JSON.stringify(data, 0, 4);
        },
        writeInfo(){        
            var setValues = this.setValues;
            var setUserInfo = this.setUserInfo;
            var silentLogin = this.silentLogin;
            var setError = this.setError;
            auth0.parseHash(function(err, data) {
                if (data) {
                    setValues(data);
                    auth0.client.userInfo(data.accessToken, function(err, user) {
                        setUserInfo(user);
                    });
                } else {
                    if (err === null){
                        silentLogin();
                    } 
                    console.log(err);
                    setError(err);
                }
            })
        },
        setError(err){
            this.error = err;
        },
        copyToClipboard(copyText, val){
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(val).select();
            document.execCommand("copy");
            $temp.remove();
            this.showToast(copyText);
        },
        showToast(copyText){
            this.copyText = copyText + ' Copied to Clipboard';
            $('.toast').toast('show');
        },
        getAPIToken (){
            var setApiToken = this.setApiToken;
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://" + this.domain + "/oauth/token",
                "method": "POST",
                "headers": {
                  "content-type": "application/json"
                },
                "data": "{\"scope\":\"read:client_grants\", \"client_id\":\"" + this.apiClientId + "\",\"client_secret\":\"" + this.apiClientSecret + "\",\"audience\":\"https://" + this.normalDomain + "/api/v2/\",\"grant_type\":\"client_credentials\"}"
              }
              
              $.ajax(settings).done(function (response) {
                setApiToken(response.access_token)
              });
        },
        setApiToken(val){
            this.apiToken = val;
            this.childToParent();
        },
        editAudience (){
            var setAudienceList = this.setAudienceList;
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://" + this.domain + "/api/v2/resource-servers",
                "method": "GET",
                "headers": {
                    "authorization": "Bearer " + this.apiToken,
                    "content-type": "application/json"
                }
              }
              
              $.ajax(settings).done(function (response) {
                setAudienceList(response);
              });
        },
        setAudienceList (val){
            var audList = [];
            val.forEach(element => {
                audList.push(element.identifier)
            });
            this.audienceList = audList;
        },
        saveAudience (val){
            document.cookie = this.clientId +"_Audience=" + val;
            this.audience = val;
        },
        editConnection (){
            this.canDeleteConnections = false;

            var setConnectionList = this.setConnectionList;
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://" + this.domain + "/api/v2/connections",
                "method": "GET",
                "headers": {
                    "authorization": "Bearer " + this.apiToken,
                    "content-type": "application/json"
                }
              }
              
              $.ajax(settings).done(function (response) {
                setConnectionList(response);
              });
        },
        getConnectionURL (connection){
            switch(connection.strategy){
                case("oidc"):
                case("waad"):
                case("ad"):
                case("samlp"):
                    return this.websiteLink + "/connections/enterprise/" + connection.strategy + "/" + connection.id  + "/settings";
                case("auth0"):
                    return this.websiteLink + "/connections/database/" + connection.id  + "/settings";
                case("apple"):
                case("linkedin"):
                case("facebook"):
                case("soundcloud"):
                case("twitter"):
                case("windowslive"):
                case("yahoo"):
                case("google-oauth2"):
                    return this.websiteLink + "/connections/social/" + connection.id  + "/settings";
                case("email"):
                case("sms"):
                    return this.websiteLink + "/connections/passwordless";

            }
        },
        setConnectionList (val){
            var conList = [];
            var getConnectionURL = this.getConnectionURL;
            val.forEach(element => {
                var enabled = false;
                if (element.enabled_clients.includes(this.clientId)){
                    enabled = true;
                }
                element.enabled = enabled;
                element.url = getConnectionURL(element);
                conList.push(element);
            });
            this.connectionList = conList;
        },
        saveConnection (val){
            document.cookie = this.clientId +"_Connection=" + val;
            this.connection = val;
            
        },
        clearConnection (){
            document.cookie = this.clientId +"_Connection=" ;
            this.connection = "";
            this.tempConnection = "";
        },
        deleteConnection (val){ 
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://" + this.domain + "/api/v2/connections/" + val.id,
                "method": "DELETE",
                "headers": {
                    "authorization": "Bearer " + this.apiToken,
                    "content-type": "application/json"
                }
              }
              
              $.ajax(settings).done(function (response) {
                console.log(response);
              });


        },
        toggleConnectionEnabled(val){
            var enabledClients = val.enabled_clients;
            var stringedClient = [];
            if (val.enabled_clients.includes(this.clientId)){
                enabledClients.splice( enabledClients.indexOf(this.clientId), 1 );
            } else {
                enabledClients.push(this.clientId);
            }

            for (let i = 0; i < enabledClients.length; i++) {
                const element = enabledClients[i];
                stringedClient.push('"' + element.toString() + '"');
            }

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://" + this.domain + "/api/v2/connections/" + val.id,
                "method": "PATCH",
                "headers": {
                    "authorization": "Bearer " + this.apiToken,
                    "content-type": "application/json"
                },
                "data": "{\"enabled_clients\":[" + stringedClient + "]}"

            }
            
            $.ajax(settings).done(function (response) {
                
            });
        },
        childToParent (){
            var info = {
                'accessToken': this.accessToken,
                'apiToken': this.apiToken
            }
            bus.$emit('set-api-token', this.apiToken)
            this.$emit('set-info-child-to-parent', info);
        },
        getWebsiteLink (){
            var domainSplit = this.normalDomain.split(".");
            this.websiteLink = "https://manage.auth0.com/dashboard/" + domainSplit[1] + "/" + domainSplit[0];
            this.inspectorLink = "https://support.it.auth0.com/inspector/" + domainSplit[0]+ "@" + domainSplit[1] + "/settings?preselect=true";
            this.realtimeExtension = "https://" + domainSplit[0] + ".au8.webtask.io/a9446dcf57413cd0ec81c8a5456518f9";
        }
    },
    created(){
        this.getWebsiteLink();
        this.domain = this.customDomain ? this.customDomain : this.normalDomain;
        var audienceCookie = getCookie(this.clientId + "_Audience");
        if (audienceCookie){
            this.audience = audienceCookie;
            this.tempAudience = audienceCookie;
        } else {
            this.audience = this.promptAudience;
            this.tempAudience = this.promptAudience;
        }
        var connectionCookie = getCookie(this.clientId + "_Connection");
        if (connectionCookie){
            this.connection = connectionCookie;
            this.tempConnection = connectionCookie;
        } else {
            this.connection = this.promptConnection;
            this.tempConnection = this.promptConnection;
        }

        var showToast = this.showToast;
        bus.$on('show-toast', function(text) {
            showToast(text);
         })
    },
    mounted(){
        this.getAPIToken();
        this.writeInfo();

        // if (getParameterByName('error_description'))
        // {
        //     this.error = getParameterByName('error_description')
        // } 
    }
})



