

    var auth0 = new auth0.WebAuth({
      domain: CUSTOMDOMAIN ? CUSTOMDOMAIN : DOMAIN,
      clientID: CLIENT_ID,
      responseType: RESPONSE_TYPE,
      redirectUri: URL,
      scope: SCOPE
    })

    var app = new Vue({
      el: '#app',
      data: {
        domain: DOMAIN,
        customDomain: CUSTOMDOMAIN,
        clientId: CLIENT_ID,
        audience: AUDIENCE ,
        scope: SCOPE,
        connection: CONNECTION,
        responseType: RESPONSE_TYPE,
        prompt: PROMPT.prompt,
        apiClientID: APICLIENTID,
        apiClientSecret: APICLIENTSECRET,
        accessToken: '',
        apiToken: '',
      },
      methods: {
        setInfoFromChild (val){
          this.apiToken = val.apiToken;
        }
      }
    })