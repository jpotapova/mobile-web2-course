(function (exports) {

  // localStorage feature detection, return true if localStorage is supported
  function localStorageSupported() {
    try {
        localStorage.setItem('testLocalstorage', 'present');
        localStorage.removeItem('testLocalstorage');
        return true;
    } catch(e) {
        return false;
    }
  }

  /* the very first js function to be execute on page load initialises the rest
    of the app functionality, depending on the features that are supported */
  function initApp() {

    /* if local storage is not supported, there is no point in
      loading any of app logic (there is no suitable polyfill for localStorage
      in our case, and developing a solution for storing data on the server is out
      of scope of this exercise), we will simply report to the user,
      that the app is not usable in this browser */
    if (localStorageSupported()) {
      if (!"JSON" in window) {
          document.write('<script src="json2.js"><\/script>');
      }
      document.write('<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"><\/script>');
      document.write('<script src="diary.js"><\/script>');
    } else {
      document.getElementById('page').innerHTML = '<p>Sorry! It is not possible to use the diary with this browser. Please try upgrading or use another browser.</p>';
    }

  }

  initApp();

})(window);
