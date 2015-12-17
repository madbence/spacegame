import config from '../../../config';

const conf = {
  ws: {
    url: config.ws.url,
  },
};

const analytics = config.analytics.id ? `
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', '${config.analytics.id}', 'auto');
  ga('send', 'pageview');
</script>` : '';

export default function* (next) {

  function html(route) {
    const state = {
      route,
      messages: [],
      game: null,
      client: {
        state: 'disconnected',
        id: null,
      },
    };
    return `<!doctype html>
<meta charset=utf-8 />
<link rel=stylesheet href=style.css />
<title>SpaceGame</title>
<div id=mount></div>
<script>
window.__CONFIG__ = ${JSON.stringify(conf)};
window.__INITIAL_STATE__ = ${JSON.stringify(state)};
</script>
<script src=bundle.js></script>${analytics}`;
  }

  switch (this.path) {
    case '/':
    case '/login':
    case '/lobby':
    case '/game':
      this.body = html(this.path);
      break;
    default:
      yield* next;
  }
}
