const baseUrl = 'http://localhost:3030';

let user = {
    email: '',
    password: '123456' 
};

let token = '';
let userId = '';

let lastCreatedEventId = '';
let myEvent = {
    author: "Random author",
    date: '25.06.24',
    title: '',
    description: '',
    imageUrl: '/images/Moulin-Rouge!-The-Musical.jpg'
}

QUnit.config.reorder = false;

QUnit.module('User functionalities', ()=>{
    QUnit.test('registration', async(assert)=>{
        let path = '/users/register';

        let random = Math.floor(Math.random() * 10000);

        let email = `abv${random}@abv.bg`;
        user.email = email;

        //act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify(user)
        });

        let json = await response.json();

        assert.ok(response.ok);

        assert.ok(json.hasOwnProperty('email'), 'email exists');
        assert.equal(json['email'], user.email, 'expected email');
        assert.strictEqual(typeof json.email, 'string', 'email has correect type');

        assert.ok(json.hasOwnProperty('password'), 'password exists');
        assert.equal(json['password'], user.password, 'expected password');
        assert.strictEqual(typeof json.password, 'string', 'password has correect type');

        assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn exists');
        assert.strictEqual(typeof json._createdOn, 'number', '_createdOn has correect type');

        assert.ok(json.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof json._id, 'string', '_id has correect type');

        assert.ok(json.hasOwnProperty('accessToken'), 'accessToken exists');
        assert.strictEqual(typeof json.accessToken, 'string', 'accessToken has correect type');

        token = json['accessToken'];
        userId = json['_id'];

        sessionStorage.setItem('event-user', JSON.stringify(user));
    });

    QUnit.test('Login', async (assert)=>{
        //arrange

        let path = '/users/login';

        //act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify(user)
        });

        let json = await response.json();

        //assert
        assert.ok(response.ok);

        assert.ok(json.hasOwnProperty('email'), 'email exists');
        assert.equal(json['email'], user.email, 'expected email');
        assert.strictEqual(typeof json.email, 'string', 'email has correect type');

        assert.ok(json.hasOwnProperty('password'), 'password exists');
        assert.equal(json['password'], user.password, 'expected password');
        assert.strictEqual(typeof json.password, 'string', 'password has correect type');

        assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn exists');
        assert.strictEqual(typeof json._createdOn, 'number', '_createdOn has correect type');

        assert.ok(json.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof json._id, 'string', '_id has correect type');

        assert.ok(json.hasOwnProperty('accessToken'), 'accessToken exists');
        assert.strictEqual(typeof json.accessToken, 'string', 'accessToken has correect type');

        token = json['accessToken'];
        userId = json['_id'];

        sessionStorage.setItem('event-user', JSON.stringify(user));
    });

});


QUnit.module('Event functionalities', ()=>{
    QUnit.test('get all events', async (assert)=>{

        let path = '/data/theaters';
        let queryParams = '?sortBy=_createdOn%20desc&distinct=title';


        let response = await fetch(baseUrl + path + queryParams);
        let json = await response.json();


        assert.ok(response.ok, 'response is ok');
        assert.ok(Array.isArray(json), 'response is array');

        json.forEach(jsonData =>{
            assert.ok(jsonData.hasOwnProperty('author'), 'Author property exists');
            assert.strictEqual(typeof jsonData.author, 'string', 'Author is correct type');

            assert.ok(jsonData.hasOwnProperty('date'), 'Date property exists');
            assert.strictEqual(typeof jsonData.date, 'string', 'Author is correct type');

            assert.ok(jsonData.hasOwnProperty('description'), 'Description property exists');
            assert.strictEqual(typeof jsonData.description, 'string', 'Description is correct type');

            assert.ok(jsonData.hasOwnProperty('imageUrl'), 'imageUrl property exists');
            assert.strictEqual(typeof jsonData.imageUrl, 'string', 'imageUrl is correct type');

            assert.ok(jsonData.hasOwnProperty('title'), 'title property exists');
            assert.strictEqual(typeof jsonData.title, 'string', 'title is correct type');

            assert.ok(jsonData.hasOwnProperty('_createdOn'), '_createdOn property exists');
            assert.strictEqual(typeof jsonData._createdOn, 'number', '_createdOn is correct type');

            assert.ok(jsonData.hasOwnProperty('_id'), '_id property exists');
            assert.strictEqual(typeof jsonData._id, 'string', '_id is correct type');

            assert.ok(jsonData.hasOwnProperty('_ownerId'), '_ownerId property exists');
            assert.strictEqual(typeof jsonData._ownerId, 'string', '_ownerId is correct type');
        });
    });

    QUnit.test('Create event', async(assert)=>{
        //arrange
        let path = '/data/theaters';
        let random = Math.floor(Math.random() * 10000);

        myEvent.title = `Random title ${random}`;
        myEvent.description = `Random description ${random}`;

        //act

        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type' : 'application/json',
                'X-Authorization' : token
            },
            body: JSON.stringify(myEvent)   
        })
        let jsonData = await response.json();

        //assert

        assert.ok(response.ok, 'Response is ok');

        assert.ok(jsonData.hasOwnProperty('author'), 'Author property exists');
        assert.strictEqual(jsonData.author, myEvent.author, 'Author is expected');
        assert.strictEqual(typeof jsonData.author, 'string', 'Author is correct type');

        assert.ok(jsonData.hasOwnProperty('date'), 'Date property exists');
        assert.strictEqual(jsonData.date, myEvent.date, 'date is expected');
        assert.strictEqual(typeof jsonData.date, 'string', 'Author is correct type');

        assert.ok(jsonData.hasOwnProperty('description'), 'Description property exists');
        assert.strictEqual(jsonData.description, myEvent.description, 'description is expected');
        assert.strictEqual(typeof jsonData.description, 'string', 'Description is correct type');

        assert.ok(jsonData.hasOwnProperty('imageUrl'), 'imageUrl property exists');
        assert.strictEqual(jsonData.imageUrl, myEvent.imageUrl, 'imageUrl is expected');
        assert.strictEqual(typeof jsonData.imageUrl, 'string', 'imageUrl is correct type');

        assert.ok(jsonData.hasOwnProperty('title'), 'title property exists');
        assert.strictEqual(jsonData.title, myEvent.title, 'title is expected');
        assert.strictEqual(typeof jsonData.title, 'string', 'title is correct type');

        assert.ok(jsonData.hasOwnProperty('_createdOn'), '_createdOn property exists');
        assert.strictEqual(typeof jsonData._createdOn, 'number', '_createdOn is correct type');

        assert.ok(jsonData.hasOwnProperty('_id'), '_id property exists');
        assert.strictEqual(typeof jsonData._id, 'string', '_id is correct type');

        assert.ok(jsonData.hasOwnProperty('_ownerId'), '_ownerId property exists');
        assert.strictEqual(typeof jsonData._ownerId, 'string', '_ownerId is correct type');

        lastCreatedEventId = jsonData._id;
    });

    QUnit.test('Event edit', async(assert)=>{

        //arrange
        let path = '/data/theaters';
        let random = Math.floor(Math.random() * 10000);

        myEvent.title = `Random title ${random}`;
        let response = await fetch(baseUrl + path + `/${lastCreatedEventId}`, {
            method: 'PUT',
            headers: {
                'content-type' : 'application/json',
                'X-Authorization' : token
            },
            body: JSON.stringify(myEvent)   
        })
        let jsonData = await response.json();

        assert.ok(response.ok, 'Response is ok');

        assert.ok(jsonData.hasOwnProperty('author'), 'Author property exists');
        assert.ok(jsonData.author.length > 0, 'string is not empty');
        assert.strictEqual(jsonData.author, myEvent.author, 'Author is expected');
        assert.strictEqual(typeof jsonData.author, 'string', 'Author is correct type');

        assert.ok(jsonData.hasOwnProperty('date'), 'Date property exists');
        assert.strictEqual(jsonData.date, myEvent.date, 'date is expected');
        assert.strictEqual(typeof jsonData.date, 'string', 'Author is correct type');

        assert.ok(jsonData.hasOwnProperty('description'), 'Description property exists');
        assert.strictEqual(jsonData.description, myEvent.description, 'description is expected');
        assert.strictEqual(typeof jsonData.description, 'string', 'Description is correct type');

        assert.ok(jsonData.hasOwnProperty('imageUrl'), 'imageUrl property exists');
        assert.strictEqual(jsonData.imageUrl, myEvent.imageUrl, 'imageUrl is expected');
        assert.strictEqual(typeof jsonData.imageUrl, 'string', 'imageUrl is correct type');

        assert.ok(jsonData.hasOwnProperty('title'), 'title property exists');
        assert.strictEqual(jsonData.title, myEvent.title, 'title is expected');
        assert.strictEqual(typeof jsonData.title, 'string', 'title is correct type');

        assert.ok(jsonData.hasOwnProperty('_createdOn'), '_createdOn property exists');
        assert.strictEqual(typeof jsonData._createdOn, 'number', '_createdOn is correct type');

        assert.ok(jsonData.hasOwnProperty('_id'), '_id property exists');
        assert.strictEqual(typeof jsonData._id, 'string', '_id is correct type');

        assert.ok(jsonData.hasOwnProperty('_ownerId'), '_ownerId property exists');
        assert.strictEqual(typeof jsonData._ownerId, 'string', '_ownerId is correct type');

        lastCreatedEventId = jsonData._id;
    })

    QUnit.test('Delete event', async (assert)=>{

        //arrange
        let path = '/data/theaters';

        //act

        let response = await fetch(baseUrl + path + `/${lastCreatedEventId}`, {
            method: 'DELETE',
            headers: {
                'X-Authorization' : token
            }
        })
        assert.ok(response.ok);
    })
})
