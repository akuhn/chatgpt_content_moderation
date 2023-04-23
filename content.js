(function() {
  console.log("ChatGPT moderation: blocking disabled");

  window.chatgpt_moderation_blocking_disabled = true;

  let __fetch = window.fetch;
  window.fetch = async function(url, options) {

    if (url.match(/\/backend-api\/conversation\/[0-9a-f]+/)) {
      let response = await __fetch(url, options);
      let data = await response.json();
      // console.log(url, data);
      for (let each of data.moderation_results) {
        if (each.blocked) {
          each.blocked = false;
          each.flagged = true;
        }
      }
      response.json = async () => data;
      return response;
    }

    if (url.includes("/backend-api/moderations")) {
      let response = await __fetch(url, options);
      let data = await response.json();
      // console.log(url, data);
      if (data.blocked) {
        console.log("Downgraded moderation from blocked to flagged message.", moderation_id);
        data.blocked = false;
        data.flagged = true;
      }
      console.log(url, data);
      response.json = async () => data;
      return response;
    }

    return __fetch(url, options);
  };
})();
