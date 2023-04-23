(function() {

    console.log("Em was here");

    var __fetch = window.fetch;
    window.fetch = async function(url) {
        if (url.includes("/backend-api/conversation/")) {
            return __fetch.apply(this, arguments).then(response => {
                var __json = response.json;
                response.json = async function() {
                    return __json.apply(this, arguments).then(data => {
                        // Disable moderation results...
                        data.moderation_results = [];
                        return data;
                    });
                }
                return response;
            });
        }
        if (url.includes("/backend-api/moderations")) {
            // console.log("/backend-api/moderations", arguments);
            return __fetch.apply(this, arguments).then(response => {
                var __json = response.json;
                response.json = async function() {
                    return __json.apply(this, arguments).then(data => {
                        // console.log("/backend-api/moderations => data", data);
                        if (data.blocked) {
                            console.log("Downgrading moderation from blocked to flagged.");
                            data.blocked = false;
                            data.flagged = true;
                        }
                        return data;
                    });
                }
                return response;
            });
        }
        else {
            return __fetch.apply(this, arguments);
        }
    }

})();
