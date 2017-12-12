module.exports = {
  dev: function (data) {
    return `
    <!doctype html>

    <html>
      <head>
        <title>React Starter</title>
        <script type="text/javascript" src="https://js.stripe.com/v2/"></script>
      </head>
      <body>
        <div id='root'/>
        <script src="./${data.main}"></script>
        <script type="text/javascript">
          Stripe.setPublishableKey("pk_test_ZEdZGDKzaVhFXjSUeVsluQRS")
        </script>
      </body>
    </html>
    `
  },
  prod: function (data) {
    return `
    <!doctype html>

    <html>
      <head>
        <title>React Starter</title>
        <script type="text/javascript" src="https://js.stripe.com/v2/"></script>
        <link rel="stylesheet" href="./${data.css}" />

      </head>
      <body>
        <div id='root'/>
        <script src="./${data.main}"></script>
        <script type="text/javascript">
          Stripe.setPublishableKey("pk_live_eVfGL0K2NQ4nD9TitEyAndZV")
        </script>
      </body>
    </html>
    `
  }
}
