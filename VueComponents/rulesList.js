
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
                        <h5 class='modal-title' id='rulesModalLabel'>Rules List</h5>\
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
                                <td>{{option.name}}</td>\
                                <td><code style='white-space: pre-wrap;' v-bind:style='{ color: option.enabled ? \"\" : \"black\"}'>{{option.script}}</code></td>\
                                <td>{{option.order}}</td>\
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
        copyToClipboard(copyText, text){
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(text).select();
            document.execCommand("copy");
            $temp.remove();
            this.copyText = copyText + ' Copied to Clipboard';
            $('.toast').toast('show');
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
                // console.log(response);
                setRulesList(response);
            });
        },
        setRulesList(val){
            var rules = [];
            val.forEach(element => {
                var rule = { "id": element.id,  "name": element.name, "script": element.script, "enabled": element.enabled, "order": element.order};
                rules.push(rule)
            });
            rules.sort(compareValues('order', 'asc'));

            this.rulesList = rules;
            this.loading = false;
        },
        toggleRuleEnabled(rule) {
            // console.log(rule);
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
                // console.log(response);
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
    },
    mounted(){
      
    }
})



