document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    if (detectIEEdge()) {
      renderSupportContent();
    }
  }
}


function renderSupportContent() {
  var div = document.createElement('div');
  div.style.width = '100%';
  div.style.height = '100%';
  div.style.display = 'table-cell';
  div.style.verticalAlign = 'middle';
  document.documentElement.style.height = '100%';
  document.documentElement.style.overflow = 'hidden';
  document.documentElement.style.fontFamily = 'Tahoma';

  // div.appendChild(createLogo());
  div.appendChild(createHeadline());
  div.appendChild(createButton('Скачать Chrome', 'https://www.google.com/intl/ru_ALL/chrome/'));
  div.appendChild(createButton('Скачать Opera', 'https://www.opera.com/ru'));
  div.appendChild(createButton('Скачать Firefox', 'https://www.mozilla.org/ru/firefox/new/'));

  document.body.innerHTML = '';
  document.body.appendChild(div);
  setBodyStyle();
}

function setBodyStyle() {
  var body = document.getElementsByTagName('body')[0];
  body.style.background = '#64009C';
  body.style.textAlign = 'center';
  body.style.display = 'table';
  body.style.justifyContent = 'center';
  body.style.verticalAlign = 'middle';
  body.style.textAlign = 'center';
  body.style.width = '100%';
  body.style.height = '100%';
}

function createLogo() {
  var div = document.createElement('div');
  div.style.background = 'url(/assets/icons/chrome.svg) no-repeat center';
  div.style.width = '75px';
  div.style.height = '75px';
  div.style.margin = '0 auto';

  return div;
}

function createHeadline() {
  var h1 = document.createElement('h1');
  h1.innerHTML = 'Веб-интерфейс работает только<br>в современных браузерах';
  h1.style.color = '#FFFFFF';
  h1.style.margin = '40px auto';
  h1.style.fontSize = '28px';

  return h1;
}

function createButton(text, link) {
  var button = document.createElement('button');
  button.innerText = text;
  button.onclick = function() {
    // document.location.href = link;
    window.open(link, '_blank').focus();
  };

  button.style.padding = '12px 30px';
  button.style.backgroundColor = 'transparent';
  button.style.border = '2px solid #FFFFFF';
  button.style.textTransform = 'uppercase';
  button.style.color = '#FFFFFF';
  button.style.borderRadius = '4px';
  button.style.fontWeight = '600';
  button.style.cursor = 'pointer';
  button.style.fontSize = '14px';
  button.style.margin = 'auto 10px'

  return button;
}

function detectIEEdge() {
  var ua = window.navigator.userAgent;

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}
