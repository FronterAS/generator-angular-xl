angular.module('<%= scriptAppName %>')
    .run(function (Config, $httpBackend, $log, APIBaseUrl, regexEscape, guid) {

        //Only load mocks if config says so
        if(!Config.useMocks) return;

        var collectionUrl = '<%= dasherizedName %>';
        var IdRegExp = /[\d\w-_]+$/;

        console.log('Stubbing <%= dasherizedName %> API - ' + APIBaseUrl + collectionUrl);
        console.log('************');

        var <%= classedName %>Repo = {};
        <%= classedName %>Repo.data = [{id: guid(), text:'Hello World'}];
        <%= classedName %>Repo.index = {};

        angular.forEach(<%= classedName %>Repo.data, function(item, key) {
            <%= classedName %>Repo.index[item.id] = item; //Index messages to be able to do efficient lookups on id
        });

        //GET <%= dasherizedName %>/ should return a list og messages
        $httpBackend.whenGET(APIBaseUrl + collectionUrl).respond(function(method, url, data, headers) {
            $log.log('Intercepted GET to <%= dasherizedName %>', data);
            return [200, <%= classedName %>Repo.data, {/*headers*/}];
        });

        //POST <%= dasherizedName %>/ should save a message and return the message with an id
        $httpBackend.whenPOST(APIBaseUrl + collectionUrl).respond(function(method, url, data, headers) {
            $log.log('Intercepted POST to <%= dasherizedName %>', data);
            var <%= classedName %> = angular.fromJson(data);

            <%= classedName %>.id = guid();
            <%= classedName %>Repo.data.push(<%= classedName %>);
            <%= classedName %>Repo.index[<%= classedName %>.id] = <%= classedName %>;

            return [200, <%= classedName %>, {/*headers*/}];
        });

        //GET <%= dasherizedName %>/id should return a message
        $httpBackend.whenGET( new RegExp(regexEscape(APIBaseUrl + collectionUrl + '/') + IdRegExp.toString() ) ).respond(function(method, url, data, headers) {
            $log.log('Intercepted GET to <%= dasherizedName %>');
            var id = url.match( IdRegExp )[0];
            return [200, <%= classedName %>Repo.index[id] || null, {/*headers*/}];
        });

    });


