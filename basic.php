<?php include("php/head.php") ?>
  <script src="https://cdn.auth0.com/js/auth0/9.11.2/auth0.min.js"></script>
<?php include("php/header.php") ?>
  <h1> Basic</h1>
  <div id="app">
    <?php include("php/additionalOptions.php") ?>
    </br>
    <login-process 
      v-on:set-info-child-to-parent="setInfoFromChild($event)"
      :normal-domain="domain" 
      :client-id="clientId" 
      :scope="scope"
      :prompt-connection="connection" 
      :prompt-audience="audience" 
      :sms-login="false"
      :prompt='prompt'
      :api-client-id='apiClientID'
      :passwordless-login='false'
      :api-client-secret='apiClientSecret'>
    </login-process>
  </div>
  <div id="logs"></div>

  <?php include("php/scripts.php") ?>

<script>
    //Values for a Regular Web App
    DOMAIN = '';
    CLIENT_ID = '';
    
    AUDIENCE = '';
    CONNECTION = '';
    SCOPE = 'openid profile email';
    RESPONSE_TYPE = 'token id_token';
    
    PROMPT = '';
    
    //These values are from the API Explorer Application 
    APICLIENTID = '';
    APICLIENTSECRET = '';
    
  </script>
  <script src="/js/vueComp.js"></script>

</body>
</html>


