define(
  ['apres', 'jquery'],
  function(apres, $) {
    var SauceConfigWidget = function(elem, params) {
      var params = apres.controller().params;

      function load(url) {
        elem.find('.details').addClass('hide');
        elem.find('.alert').removeClass().addClass("alert alert-info").html("Loading ...");
        $.ajax({
          url: "/api/sauce",
          type: "GET",
          data: {url: url},
          dataType: "json",
          success: function (data, ts, xhr) {
            elem.find('.sauce-username').val(data.results.sauce_username);
            elem.find('.sauce-access-key').val(data.results.sauce_access_key);
            elem.find('.details').show();
            elem.find('.alert').removeClass().hide();
          },
          error: function(xhr, ts, e) {
            if (xhr && xhr.responseText) {
                var data = $.parseJSON(xhr.responseText);
                message("Error loading Sauce config: " + data.errors[0], "alert-error");
            } else {
                message("Error loading Sauce config: " + e, "alert-error");
            }
          }

        });
      }
      
      this.events = {
        "click #sauce-save": function() {
          console.log("sauce click");
          var sauce_username = elem.find(".sauce-username").val();
          var sauce_access_key = elem.find(".sauce-access-key").val();
          $.ajax("/api/sauce", {
                data: {url:params.repo_url, sauce_username:sauce_username, sauce_access_key:sauce_access_key},
                error: function(xhr, ts, e) {
                  console.log(e);
                  $(".alert")
                    .removeClass().addClass("alert alert-error").html("Error saving sauce credentials.");
                },
                success: function(data, ts, xhr) {
                  $(".alert")
                    .removeClass().addClass("alert alert-success").html("Sauce credentials saved.");
                },
                type: "POST",
          });
        }
      };
      // There is a global "repo" object which is generated by the server
      var repo_url = apres.controller().params.repo_url;
      load(repo_url);
      
    };

    return SauceConfigWidget;
  }
);
