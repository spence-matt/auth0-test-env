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
        'redirectUrl',
        'apiClientSecret',
        'apiClientId'
    ],
    template: "\
    <div>\
        <div>Domain: {{domain}} <a target='_blank' :href='websiteLink'>Dashboard</a>&nbsp;&nbsp;&nbsp;<a target='_blank' :href='websiteLink + \"/login_settings\"'>Lock</a></div>\
        <div>Client ID: {{clientId}} <a target='_blank' :href=\"websiteLink + '/applications/'+ clientId + '/settings' \">App Settings</a></div>\
        <div>Audience: {{audience}} <a href='#' @click.prevent='editAudience' data-toggle='modal' data-target='#audienceModal'>(Edit)</a></div>\
        <div>Connection: {{connection}} <a href='#' @click.prevent='editConnection' data-toggle='modal' data-target='#connectionModal'>(Edit)</a></div>\
        </br>\
        <button type='button' class='btn btn-dark btn-sm' @click.prevent='login'>Login</button>\
        <button type='button' class='btn btn-dark btn-sm' @click.prevent='loginWithPopup'>Login with Popup</button>\
        <button v-if='passwordlessLogin' type='button' class='btn btn-dark btn-sm' @click.prevent='loginPasswordless'>Login Passwordless</button>\
        <button type='button' class='btn btn-dark btn-sm' @click.prevent='silentLogin'>Silent Login</button>\
        <button type='button' class='btn btn-dark btn-sm' @click.prevent='logout'>Logout</button>\
        <button type='button' class='btn btn-dark btn-sm' @click.prevent='logoutFederated'>Logout Federated</button>\
        <br>\
        <br>\
        <button type='button' class='btn btn-info btn-sm' @click.prevent='copyToClipboard(\"API Access Token\", apiToken)'>Get API Token</button>\
        </br>\
        </br>\
        <div v-if='error == \"Loading...\"' class='alert alert-warning' role='alert'>\
            {{error}}\
        </div>\
        <div v-else-if='error' class='alert alert-danger' role='alert'>\
            {{error}}\
        </div>\
        <div v-else class='alert alert-success' role='alert'>\
            Loaded\
        </div>\
        <div v-if='values'>\
            <div class='row'>\
                <div class='col-lg-6'>\
                    <a href='#' @click.prevent='copyToClipboard(\"Access Payload Token\", accessTokenPayload)'><strong style='font-size:20px'>Access Token Payload:</strong></a>\
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
                            <input class='form-check-input' type='radio' name='exampleRadios' :id='option' v-model='tempAudience' :value='option' checked>\
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
            <div class='modal-dialog modal-lg' role='document'>\
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
                                    <th scope='col'>Strategy</th>\
                                    <th scope='col'>Enabled</th>\
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
                                    <td>{{option.name}}</td>\
                                    <td>{{option.strategy}}</td>\
                                    <td>\
                                        <label class='switch' >\
                                            <input type='checkbox' v-on:click='toggleConnectionEnabled(option)' v-model='option.enabled'>\
                                            <span class='slider'></span>\
                                        </label>\
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
                    {{copyText}} \
                </div>\
            </div>\
        </div>\
    </div>\
    ",
    data: function(){
        return{
            websiteLink: '',
            domain: '',
            audience: '', 
            tempAudience: '',
            audienceList: [],
            tempConnection: '',
            connection: '',
            connectionList: [],
            apiToken: '',
            accessToken: '', 
            accessTokenPayload: '', 
            idToken: '',
            idTokenPayload: '',
            userInfo: '',
            values: false,
            error: 'Loading...',
            auth0Client: '',
            copyText: ''

        }
    },
    methods: {
        async login () {
            await this.auth0Client.loginWithRedirect({
				redirect_uri: URL
			})
        },
        async silentLogin () {
            await this.auth0Client.loginWithRedirect({
                prompt: 'none',
				redirect_uri: URL
			})
        },
        async loginWithPopup (){
            await this.auth0Client.loginWithPopup();
        },
        loginPasswordless (){
            var lockPasswordless = new Auth0LockPasswordless(this.clientId, this.domain);
            lockPasswordless.show({
                passwordlessMethod: 'link'
            });
        },
        logout () {
            this.auth0Client.logout({
                returnTo: URL
            });
        },
        logoutFederated(){
            this.auth0Client.logout({
              federated: true,
              returnTo: URL,
              clientID: CLIENT_ID
            })
        },
        setValues (data, valType) {
            this.values = true;
            // this.accessToken = data.accessToken;
            if (valType == "user"){
                this.userInfo = JSON.stringify(data, 0, 4);
            } else if (valType == "access"){
                this.accessToken = data;
                if (data.startsWith('eyJ')) {
                    var atp = JSON.parse(atob(data.split('.')[1]))
                    this.accessTokenPayload = JSON.stringify(atp, 0, 4);
                }
            } else if (valType == "id"){
                this.idToken = data.__raw;
                this.idTokenPayload = JSON.stringify(data, 0, 4);
                this.error = '';
            }

        },
        async writeInfo(){        
            var setValues = this.setValues;
            var setError = this.setError;

            
            this.auth0Client.getTokenSilently()
            .then(function(result){
                setValues(result, "access");
            })
            .catch(function(e) {
                setError(e.error_description);
            });

            this.auth0Client.getUser()
            .then(function(result){
                setValues(result, "user");
            })
            .catch(function(e) {
                setError(e.error_description);
            });
            
            this.auth0Client.getIdTokenClaims()
            .then(function(result){
                setValues(result, "id");
            })
            .catch(function(e) {
                setError(e.error_description);
            });

        
        },
        setError (e){
            this.error = e;
        },
        copyToClipboard(copyText, val){
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(val).select();
            document.execCommand("copy");
            $temp.remove();
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
                "data": "{\"client_id\":\"" + this.apiClientId + "\",\"client_secret\":\"" + this.apiClientSecret + "\",\"audience\":\"https://" + this.normalDomain + "/api/v2/\",\"grant_type\":\"client_credentials\"}"
              }
              
              $.ajax(settings).done(function (response) {
                setApiToken(response.access_token)
              });
        },
        setApiToken(val){
            this.apiToken = val;
            bus.$emit('set-api-token', this.apiToken)
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
        setConnectionList (val){
            var conList = [];
            val.forEach(element => {
                var enabled = false;
                if (element.enabled_clients.includes(this.clientId)){
                    enabled = true;
                }
                element.enabled = enabled;
                conList.push(element);
            });
            this.connectionList = conList;
        },
        saveConnection (val){
            document.cookie = this.clientId +"_Connection=" + val;
            this.connection = val;
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
        getWebsiteLink (){
            var domainSplit = this.normalDomain.split(".");
            this.websiteLink = "https://manage.auth0.com/dashboard/" + domainSplit[1] + "/" + domainSplit[0];
        }
    },
    async created(){
        this.getWebsiteLink();

        this.domain = this.customDomain ? this.customDomain : this.normalDomain;
        var audienceCookie = getCookie(this.clientId + "_Audience");
        if (audienceCookie){
            this.audience = audienceCookie;
        } else {
            this.audience = this.promptAudience;
        }
        var connectionCookie = getCookie(this.clientId + "_Connection");
        if (connectionCookie){
            this.connection = connectionCookie;
        } else {
            this.connection = this.promptConnection;
        }
        
        try {
            this.auth0Client = await createAuth0Client({
                domain: this.domain,
                client_id: this.clientId,
                audience: this.audience,
                redirect_uri: this.redirectUrl,
                connection: this.connection
            });
        } catch (e){
            this.error = e;
        } finally {
            this.getAPIToken();
            this.writeInfo();

           
        }
    }
})