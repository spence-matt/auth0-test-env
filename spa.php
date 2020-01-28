<?php include("php/head.php") ?>
  <script src="https://cdn.auth0.com/js/auth0-spa-js/1.5/auth0-spa-js.production.js"></script>
<?php include("php/header.php") ?>
  <h1>SPA</h1>
  <div id="app">
    <?php include("php/additionalOptions.php") ?>

    </br>
    <login-process 
      :normal-domain="domain" 
      :client-id="clientId" 
      :prompt-audience="audience" 
      :scope="scope"
      :connection="connection" 
      :sms-login="false"
      :passwordless-login="false"
      :redirect-url="url"
      :prompt='prompt'
      :api-client-id='apiClientID'
      :api-client-secret='apiClientSecret'>
	</login-process>
  </div>
  <div id="logs"></div>
    
  <script src="//cdn.auth0.com/js/lock/11.12.1/lock.min.js"></script>
  <script src="/VueComponents/deleteUsers.js"></script>
  <script src="/VueComponents/rulesList.js"></script>

  <script src="/VueComponents/SPAloginProcess.js"></script>
  
  <script>
    //Values for a Single Page App
    DOMAIN = '';
    CLIENT_ID = '';

    AUDIENCE = '';
    CONNECTION = '';
    SCOPE = 'openid email profile';
    RESPONSE_TYPE = 'token id_token';

	  PROMPT = '';
	
    //These values are from the API Explorer Application 
    APICLIENTID = '';
    APICLIENTSECRET = '';
    
	var app = new Vue({
    el: '#app',
    data: {
      domain: DOMAIN,
      customDomain: CUSTOMDOMAIN,
      clientId: CLIENT_ID,
      audience: AUDIENCE,
      connection: CONNECTION,
      scope: SCOPE,
      responseType: RESPONSE_TYPE,
      prompt: PROMPT,
      url: URL,
      apiClientID: APICLIENTID,
      apiClientSecret: APICLIENTSECRET
    }
	})

</script>

</body>
</html>
