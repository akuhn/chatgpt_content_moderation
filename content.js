(function() {
  console.log("ChatGPT moderation: blocking disabled");

  window.chatgpt_moderation_blocking_disabled = true;

  let __fetch = window.fetch;
  window.fetch = async function(url, options) {

    if (url.match(/\/backend-api\/conversation\/[0-9a-f]+/)) {
      return __fetch(url, options)
        .then(response => response.json())
        .then(data => {
          for (let each of data.moderation_results) {
            if (each.blocked) {
              each.blocked = false;
              each.flagged = true;
            }
          }
          let response = new Response(JSON.stringify(data));
          response.headers.set('Content-Type', 'application/json');
          return response;
        });
    }

    if (url.includes("/backend-api/moderations")) {
      return __fetch(url, options)
        .then(response => response.json())
        .then(data => {
          if (data.blocked) {
            console.log("Downgraded moderation from blocked to flagged message.", moderation_id);
            data.blocked = false;
            data.flagged = true;
          }
          console.log(url, data);
          let response = new Response(JSON.stringify(data));
          response.headers.set('Content-Type', 'application/json');
          return response;
        });
    }

    return __fetch(url, options);
  };
})();
