(function () {
  var labels = { 1: "Under $25", 2: "$25–$60", 3: "$60+" };
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function card(g) {
    return '<li class="result"><div><p class="result-from">From <a href="' + g.s + '.html">' + esc(g.g) + '</a> · ' + labels[g.b] + '</p><h3>' + esc(g.n) + '</h3><p>' + esc(g.w) + '</p></div>' +
      '<a class="buy" href="' + esc(g.u) + '" target="_blank" rel="sponsored nofollow noopener">See options on Amazon<span class="sr"> for ' + esc(g.n) + ' (opens in a new tab)</span></a></li>';
  }

  // Countdown to Christmas
  var cd = document.getElementById("countdown");
  if (cd) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var xmas = new Date(now.getFullYear(), 11, 25);
    if (today > xmas) xmas = new Date(now.getFullYear() + 1, 11, 25);
    var days = Math.round((xmas - today) / 86400000);
    cd.textContent = days === 0 ? "Merry Christmas" : days + (days === 1 ? " day" : " days") + " until Christmas";
  }

  // Seasonal switch: Black Friday strip until Cyber Monday (Nov 30), then last-minute gifts until Christmas, then hidden.
  (function () {
    var t = document.getElementById("dealTeaser"), nav = document.getElementById("navDeals");
    var now = new Date(), m = now.getMonth(), day = now.getDate();
    var lm = (t && t.getAttribute("data-lastminute")) || null;
    var phase = (m === 11 && day <= 25) ? "lastminute" : (m === 11 || m === 0 || (m >= 1 && m <= 8)) ? "off" : "bf";
    if (phase === "bf") return;
    if (phase === "lastminute") {
      if (t) {
        document.getElementById("dtHead").textContent = "Running out of time?";
        document.getElementById("dtText").textContent = "Last-minute gifts that still arrive in time, plus digital gifts you can send today.";
        var b = document.getElementById("dtBtn"); b.textContent = "See last-minute gifts"; b.href = lm;
      }
      if (nav) { nav.textContent = "Last Minute"; nav.href = nav.getAttribute("data-lm") || "index.html#guides"; }
    } else {
      if (t) t.hidden = true;
      if (nav) nav.parentNode.hidden = true;
    }
  })();

  // Black Friday countdown (deals page)
  var bf = document.getElementById("bfCount");
  if (bf) {
    var n2 = new Date(); var t2 = new Date(n2.getFullYear(), n2.getMonth(), n2.getDate());
    var y2 = n2.getFullYear();
    var bfd = new Date(y2, 10, 27), cmd = new Date(y2, 10, 30);
    var dd = Math.round((bfd - t2) / 86400000);
    if (dd > 1) bf.textContent = dd + " days until Black Friday";
    else if (dd === 1) bf.textContent = "Black Friday is tomorrow";
    else if (dd === 0) bf.textContent = "Black Friday deals are live today";
    else if (t2 <= cmd) bf.textContent = t2.getTime() === cmd.getTime() ? "Cyber Monday deals end tonight" : "Deals run through Cyber Monday, Nov 30";
    else bf.textContent = "Missed Black Friday? Many deals stick around into December";
  }

  // Budget filter on guide pages
  var chips = document.querySelectorAll(".bf");
  if (chips.length) {
    var gifts = document.querySelectorAll(".gift-list .gift");
    var empty = document.querySelector(".bf-empty");
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        var b = c.getAttribute("data-b");
        chips.forEach(function (x) { var on = x === c; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
        var shown = 0;
        gifts.forEach(function (g) { var ok = b === "0" || g.getAttribute("data-b") === b; g.hidden = !ok; if (ok) shown++; });
        if (empty) empty.hidden = shown !== 0;
      });
    });
  }

  if (!window.GIFTS) return;

  // Gift Finder
  var form = document.getElementById("finderForm");
  var list = document.getElementById("finderResults");
  var count = document.getElementById("finderCount");
  var more = document.getElementById("finderMore");
  var showAll = false;
  function render() {
    var who = form.querySelector('input[name="who"]:checked').value;
    var budget = Number(form.querySelector('input[name="budget"]:checked').value);
    var hits = window.GIFTS.filter(function (g) { return g.t.indexOf(who) !== -1 && (budget === 0 || g.b === budget); });
    hits.sort(function (a, b) { return (a.t[0] === who ? 0 : 1) - (b.t[0] === who ? 0 : 1) || a.b - b.b; });
    if (!hits.length) {
      count.textContent = "No exact matches. Try another budget or pick \u201cAny budget.\u201d";
      list.innerHTML = ""; more.hidden = true; return;
    }
    var shown = showAll ? hits : hits.slice(0, 9);
    count.textContent = hits.length > shown.length ? "Showing " + shown.length + " of " + hits.length + " ideas" : hits.length + (hits.length === 1 ? " idea" : " ideas");
    list.innerHTML = shown.map(card).join("");
    more.hidden = hits.length <= 9 || showAll;
    more.textContent = "Show all " + hits.length;
  }
  if (form) {
    form.addEventListener("change", function () { showAll = false; render(); });
    more.addEventListener("click", function () { showAll = true; render(); });
    render();
  }

  // Search
  var input = document.getElementById("giftSearch");
  var sList = document.getElementById("searchResults");
  var sCount = document.getElementById("searchCount");
  if (input) {
    var t;
    input.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var q = input.value.trim().toLowerCase();
        if (q.length < 2) { sList.innerHTML = ""; sCount.textContent = ""; return; }
        var words = q.split(/\s+/);
        var hits = window.GIFTS.filter(function (g) { return words.every(function (w) { return g.k.indexOf(w) !== -1; }); });
        sCount.textContent = hits.length ? hits.length + (hits.length === 1 ? " gift found" : " gifts found") : "Nothing found for \u201c" + input.value.trim() + "\u201d. Try a simpler word, like \u201ccar\u201d or \u201cgrill.\u201d";
        sList.innerHTML = hits.slice(0, 12).map(card).join("");
      }, 120);
    });
  }
})();
