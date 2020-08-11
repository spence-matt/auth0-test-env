$(function() {
    $('#textarea').on('keydown', function(e) {
      if (e.keyCode == 9 || e.which == 9) {
        e.preventDefault();
        var s = this.selectionStart;
        $(this).val(function(i, v) {
          return v.substring(0, s) + "\t" + v.substring(this.selectionEnd)
        });
        this.selectionEnd = s + 1;
      }
    });
  });
Vue.component('rules', {
    props: [
        'accessToken',
        'apiClientId',
        'apiClientSecret',
        'domain'
    ],
    template: "\
    <span>\
        <button type='button' @click.prevent='getRuleList' class='btn btn-info btn-sm' data-toggle='modal' data-target='#rulesModal'>Rules List</button>\
        <div class='modal fade' id='rulesModal' tabindex='-1' role='dialog' aria-labelledby='rulesModalLabel' aria-hidden='true'>\
            <div class='modal-dialog modal-xl' role='document'>\
                <div class='modal-content'>\
                    <div class='modal-header'>\
                        <h5 class='modal-title' id='rulesModalLabel'>Rules List <a target='_blank' :href='websiteLink'></a></h5>\
                        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>\
                        <span aria-hidden='true'>&times;</span>\
                        </button>\
                    </div>\
                    <div class='modal-body'>\
                        <table class='table'>\
                            <thead>\
                                <tr>\
                                    <th scope='col'></th>\
                                    <th scope='col'>Rule</th>\
                                    <th scope='col'>Script</th>\
                                    <th scope='col'>Order</th>\
                                    <th scope='col'></th>\
                                </tr>\
                            </thead>\
                            <tbody>\
                            <tr v-if='rulesList.length === 0 && !loading'>\
                                <td colspan='4' >No Rules for this tenant</td>\
                            </tr>\
                            <tr v-for='option in rulesList'>\
                                <td >\
                                    <label class='switch' >\
                                        <input type='checkbox' v-on:click='toggleRuleEnabled(option)' v-model='option.enabled'>\
                                        <span class='slider'></span>\
                                    </label>\
                                </td>\
                                <td>{{option.name}} <a target='_blank' :href='websiteLink + \"/\" +  option.id'></a></td>\
                                <td >\
                                    <code v-if='!option.editing' style='white-space: pre-wrap;' v-bind:style='{ color: option.enabled ? \"\" : \"black\"}'>{{option.script}}</code>\
                                    <textarea :id='option.id' v-else style='width: 100%;' oninput='this.style.height = \"\";this.style.height = this.scrollHeight + \"px\"'  v-model='option.script' ></textarea>\
                                </td>\
                                <td>{{option.order}}</td>\
                                <td >\
                                    <button v-if='!option.editing' style='width:80px' type='button' class='btn btn-info btn-sm' @click='setEditRule(option)'>Edit</button>\
                                    <button v-if='option.editing' style='width:80px; margin-bottom:5px;' type='button' class='btn btn-success btn-sm' @click='saveRule(option)'>Save</button>\
                                    </br v-if='option.editing'>\
                                    <button v-if='option.editing' style='width:80px' type='button' class='btn btn-danger btn-sm' @click='option.script = option.previous; option.editing = false'>Cancel</button>\
                                </td>\
                            </tr>\
                            </tbody>\
                        </table>\
                    </div>\
                    <div class='modal-footer'>\
                        <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </span>\
    ",
    data: function(){
        return{
            rulesList:[],
            deleteUserList:[],
            apiToken: '',
            loading: true
        }
    },
    methods: {
        getDomainLink(){
            var domainSplit = this.domain.split(".");
            this.websiteLink = "https://manage.auth0.com/dashboard/" + domainSplit[1] + "/" + domainSplit[0] + "/rules";
        },
        getRuleList(){
            var setRulesList = this.setRulesList;
            this.loading = true;
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://" + this.domain + "/api/v2/rules",
                "method": "GET",
                "headers": {
                    "authorization": "Bearer " + this.apiToken,
                    "content-type": "application/json"
                }
            }
              
            $.ajax(settings).done(function (response) {
                setRulesList(response);
            });
        },
        setRulesList(val){
            var rules = [];
            val.forEach(element => {
                var rule = { "id": element.id,  "name": element.name, "script": element.script, "enabled": element.enabled, "order": element.order, "editing": false};
                rules.push(rule)
            });
            rules.sort(compareValues('order', 'asc'));

            this.rulesList = rules;
            this.loading = false;
        },
        toggleRuleEnabled(rule) {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://" + this.domain + "/api/v2/rules/" + rule.id,
                "method": "PATCH",
                "headers": {
                    "authorization": "Bearer " + this.apiToken,
                    "content-type": "application/json"
                },
                "data": "{\"enabled\":" + !rule.enabled + "}"

            }
              
            $.ajax(settings).done(function (response) {
                console.log(response);
            });
        },
        setApiVal (val){
            this.apiToken = val;
        },
        setEditRule(rule){
            rule.editing = true;
            setTimeout(function(){             
                var textarea = document.getElementById(rule.id);
                textarea.style.height =  textarea.scrollHeight + "px";
            }, 10);

            rule.previous = rule.script.toString();
        },
        saveRule (rule){
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://" + this.domain + "/api/v2/rules/" + rule.id,
                "method": "PATCH",
                "headers": {
                    "authorization": "Bearer " + this.apiToken,
                    "content-type": "application/json"
                },
                "data": "{\"script\":" + JSON.stringify(rule.script) + "}"

            }
              
            $.ajax(settings).done(function (response) {
                console.log(response);
                rule.editing = false;
            });
        }
    },
    created(){
        var setApiVal = this.setApiVal;
        bus.$on('set-api-token', function(info) {
            setApiVal(info);
         })
         this.getDomainLink();
    },
    mounted(){
      
    }
})



