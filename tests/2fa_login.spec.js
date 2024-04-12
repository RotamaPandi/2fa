import { test, expect, Page } from '@playwright/test';
import MailSlurp from "mailslurp-client";

test('can login and verify email address with mailslurp', async ({ page }) => {
    // const apiKey = process.env.API_KEY;
    // expect(apiKey).toBeDefined();

    // load playground app
    await page.goto("https://playground.mailslurp.com");
    await page.click('[data-test="sign-in-create-account-link"]');

    // create a new inbox
    const mailslurp = new MailSlurp({ apiKey: '4dd7e0750a8cccaa0e6430480c80c5c588f665d125f7589af8917269d2618221' })
    const password = "test-password"
    const { id, emailAddress } = await mailslurp.createInbox()

    // fill sign up form
    await page.fill('input[name=email]', emailAddress);
    await page.fill('input[name=password]', password);
    await page.click('[data-test="sign-up-create-account-button"]');

    // wait for verification code
    const email = await mailslurp.waitForLatestEmail(id)

    // extract the confirmation code (so we can confirm the user)
    const code = /([0-9]{6})$/.exec(email.body)[1];

    // enter confirmation code
    await page.fill('[data-test="confirm-sign-up-confirmation-code-input"]', code);
    await page.click('[data-test="confirm-sign-up-confirm-button"]');

    // fill out username (email) and password
    await page.fill('[data-test="username-input"]', emailAddress);
    await page.fill('[data-test="sign-in-password-input"]', password);
    // submit
    await page.click('[data-test="sign-in-sign-in-button"]');
    await page.waitForSelector("[data-test='greetings-nav']");
    await page.waitForTimeout(5000);

    //Sign Out the session
    await page.click("//button[@class='Button__button___vS7Mv']");
  });