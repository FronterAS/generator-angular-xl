angular.module('<%= scriptAppName %>')
    .run(function (Config, $httpBackend, $log, APIBaseUrl, regexEscape, guid) {
        if(!Config.API.useMocks) return;

        var collectionUrl = APIBaseUrl + '<%= pluralizedName %>';
        var IdRegExp = /[\d\w-_]+$/.toString().slice(1, -1);

        $log.log('Overriding all calls to `' + collectionUrl + '` with mocks defined in *dev/<%= dasherizedName %>-mocks.js*');
        $log.log('*******************************************************************************************************************************************************');

        var <%= classedName %>Repo = {};
        <%= classedName %>Repo.data = [
            {id: guid(), text:'AngularJS'},
            {id: guid(), text:'Karma'},
            {id: guid(), text:'Yeoman'},
            {id: guid(), text:'Generator-angular-xl'}
        ];
        <%= classedName %>Repo.index = {};

        angular.forEach(<%= classedName %>Repo.data, function(item, key) {
            <%= classedName %>Repo.index[item.id] = item;
        });

        //GET <%= dasherizedName %>/
        $httpBackend.whenGET(collectionUrl).respond(function(method, url, data, headers) {
            $log.debug('Intercepted GET to `' + collectionUrl + '`', data);
            return [200, <%= classedName %>Repo.data, {/*headers*/}];
        });

        //POST <%= dasherizedName %>/
        $httpBackend.whenPOST(collectionUrl).respond(function(method, url, data, headers) {
            $log.debug('Intercepted POST to `' + collectionUrl + '`', data);
            var <%= classedName %> = angular.fromJson(data);

            <%= classedName %>.id = guid();
            <%= classedName %>Repo.data.push(<%= classedName %>);
            <%= classedName %>Repo.index[<%= classedName %>.id] = <%= classedName %>;

            return [200, <%= classedName %>, {/*headers*/}];
        });

        //GET <%= dasherizedName %>/id
        $httpBackend.whenGET( new RegExp(regexEscape(collectionUrl + '/') + IdRegExp ) ).respond(function(method, url, data, headers) {
            $log.debug('Intercepted GET to `' + collectionUrl + '`');
            var id = url.match( new RegExp(IdRegExp) )[0];
            return [<%= classedName %>Repo.index[id]?200:404, <%= classedName %>Repo.index[id] || null, {/*headers*/}];
        });

        //PUT <%= dasherizedName %>/id
        $httpBackend.whenPUT( new RegExp(regexEscape(collectionUrl + '/') + IdRegExp ) ).respond(function(method, url, data, headers) {
            $log.debug('Intercepted PUT to `' + collectionUrl + '`');
            var id = url.match( new RegExp(IdRegExp) )[0];

            if (!<%= classedName %>Repo.index[id]) {
                return [404, {} , {/*headers*/}];
            }

            var <%= classedName %> = <%= classedName %>Repo.index[id] = angular.fromJson(data);

            return [200, <%= classedName %>, {/*headers*/}];
        });

        //DELETE <%= dasherizedName %>/id
        $httpBackend.whenDELETE( new RegExp(regexEscape(collectionUrl + '/') + IdRegExp ) ).respond(function(method, url, data, headers) {
            $log.debug('Intercepted DELETE to `' + collectionUrl + '`');
            var id = url.match( new RegExp(IdRegExp) )[0];

            var <%= classedName %> = <%= classedName %>Repo.index[id];
            if (!<%= classedName %>) {
                return [404, {} , {/*headers*/}];
            }
            delete <%= classedName %>Repo.index[<%= classedName %>.id];
            var index = <%= classedName %>Repo.data.indexOf(<%= classedName %>);
            <%= classedName %>Repo.data.splice(index, 1);
            return [200, <%= classedName %> , {/*headers*/}];
        });

    });


