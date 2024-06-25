const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3000'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
    email : "",
    password : "123456",
    confirmPass : "123456",
};

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    
    describe("authentication", () => {
        test('register makes correct API call', async()=>{
            //arrange
            await page.goto(host);
            await page.click('text=Register');
            await page.waitForSelector('form');
            let random = Math.floor(Math.random() * 10000);
            user.email = `abv${random}@abv.bg`;

            //act
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.locator('#repeatPassword').fill(user.confirmPass);

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/register') && response.status() == 200),
                page.click('[type="submit"]')
            ])
            let userData = await response.json();

            //assert 
            await expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);

        })

        test('Login makes correct API call', async ()=>{
            //arrange
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/login') && response.status() == 200),
                page.click('[type="submit"]')
            ])
            let userData = await response.json();

            //assert 
            expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        });

        test('Logout makes the correct API call', async () =>{
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');


            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/logout') && response.status() == 204),
                page.click('nav >> text=Logout')
            ])
            
            expect(response.ok()).toBeTruthy();
            await page.waitForSelector('nav >> text=Login');
            expect(page.url()).toBe(host + '/');

        });
        
    });

    describe("navbar", () => {
        test('logged-in user should see correct navbar buttons', async()=>{

            await page.goto(host);

            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');


            await expect(page.locator('nav >> text=Theater')).toBeVisible();
            await expect(page.locator('nav >> text=Create Event')).toBeVisible();
            await expect(page.locator('nav >> text=Profile')).toBeVisible();
            await expect(page.locator('nav >> text=Logout')).toBeVisible();
            await expect(page.locator('nav >> text=Login')).toBeHidden();
            await expect(page.locator('nav >> text=Register')).toBeHidden();

        });

        test('guest user should see correct navbar buttons', async()=>{
            await page.goto(host);

            await expect(page.locator('nav >> text=Theater')).toBeVisible();
            await expect(page.locator('nav >> text=Login')).toBeVisible();
            await expect(page.locator('nav >> text=Register')).toBeVisible();
            await expect(page.locator('nav >> text=Create Event')).toBeHidden();
            await expect(page.locator('nav >> text=Profile')).toBeHidden();
            await expect(page.locator('nav >> text=Logout')).toBeHidden();

        })
    });

    describe("CRUD", () => {

        beforeEach(async ()=>{
            await page.goto(host);

            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');
        });
        

        test('create event makes correct API call', async()=>{
            await page.click('nav >> text=Create Event');
            await page.waitForSelector('form');

            await page.fill('#title', 'random title');
            await page.fill('#date', 'random date');
            await page.fill('#author', 'random author');
            await page.fill('#description', 'random description');
            await page.fill('#imageUrl', '/images/Moulin-Rouge!-The-Musical.jpg');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/theaters') && response.status() == 200),
                page.click('[type="submit"]')
            ]);
            let evenData = await response.json();

            expect(response.ok()).toBeTruthy();
            expect(evenData.title).toEqual('random title');
            expect(evenData.date).toEqual('random date');
            expect(evenData.description).toEqual('random description');
            expect(evenData.imageUrl).toEqual('/images/Moulin-Rouge!-The-Musical.jpg');

        });

        test('edit event makes correct API call', async()=>{
            await page.click('nav >> text=Profile');
            await page.waitForSelector('#profilePage');
            await page.locator('text=Details').first().click();
            await page.click('text=Edit');
            await page.waitForSelector('form');

            await page.fill('#title', 'edited title');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/theaters') && response.status() == 200),
                page.click('[type="submit"]')
            ]);
            let evenData = await response.json();

            expect(response.ok()).toBeTruthy();
            expect(evenData.title).toEqual('edited title');
            expect(evenData.date).toEqual('random date');
            expect(evenData.description).toEqual('random description');
            expect(evenData.imageUrl).toEqual('/images/Moulin-Rouge!-The-Musical.jpg');

        });

        test('Delete event makes the correct API call', async()=>{

            await page.click('nav >> text=Profile');
            await page.locator('text=Details').first().click();
            

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/theaters") && response.status() == 200 ),
                page.on('dialog', dialog => dialog.accept()),
                page.click('text=delete')
            ]);
            expect(response.ok()).toBeTruthy();
        })
        
    });
});