const signIn = document.querySelector('.login__form-signIn');
const signUp = document.querySelector('.login__form-signUp');
const signInBookmark = document.querySelector('.bookmark__SignIn');
const signUpBookmark = document.querySelector('.bookmark__SignUp');

function changeBookmarkSignUp() {
  signIn.style.display = 'none';
  signUp.style.display = 'flex';
  signUpBookmark.classList.remove('clicked');
  signInBookmark.classList.add('clicked');
}

function changeBookmarkSignIn() {
  signUp.style.display = 'none';
  signIn.style.display = 'flex';
  signUpBookmark.classList.add('clicked');
  signInBookmark.classList.remove('clicked');
}

signUpBookmark.onclick = () => {
  changeBookmarkSignUp();
};

signInBookmark.onclick = () => {
  changeBookmarkSignIn();
};
