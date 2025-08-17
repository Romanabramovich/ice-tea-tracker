import { getAuth, RecaptchaVerifier } from "firebase/auth";

const auth = getAuth();

window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
  size: "invisible",
  callback: (response) => {
    onSignInSubmit();
  },
});

recaptchaVerifier.render().then((widgetID) => {
  window.recaptchaWidgetID = widgetID;
});

const recaptchaResponse = grecaptcha.getResponse(recaptchaWidgetId);

/*
To initiate phone number sign-in
present the user an interface that prompts them to provide their phone number
and then call signInWithPhoneNumber to request
that Firebase send an authentication code to the user's phone by SMS:

Get the user's phone number.
*/
