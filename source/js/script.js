// Code goes here

(function($, document, window) {

var design_meta = [
    {
        background: 'drops.jpg',
        opts: { slogan_color: 'white' }
    },
    {
        background: 'mailbox.jpg',
        opts: { slogan_color: '#e0e0e0' }
    },
    {
        background: 'metro.jpg',
        opts: { slogan_color: 'black' }
    },
    {
        background: 'train.jpg',
        opts: { slogan_color: 'black' }
    },
    {
        background: 'aurora.jpg',
        opts: { slogan_color: '#f0f0f0' }
    },
    {
        background: 'sky.jpg',
        opts: { slogan_color: '#f0f0f0' }
    },
    {
        background: 'mountains.jpg',
        opts: { slogan_color: '#ffffff' }
    }
];

function setTunnelBackground() {
    var i = Math.floor((Math.random() * 14)) + 1 + '';
    var background_url = '/img/tunnel-page-backgrounds/bg' + i + '.jpg';

    $.backstretch(background_url);
}

function setIndexBackground() {
    var i = Math.floor((Math.random() * design_meta.length));
    var meta = design_meta[i];
    var background_url = '/img/index-page-backgrounds/' + meta.background;

    console.log('design metadata:' + JSON.stringify(meta));

    $.backstretch(background_url);
    $('.slogan').css('color', meta.opts.slogan_color);
}

function setBackground() {
    var is_tunnel_view = document.getElementById('WaitForTalk');
    if (!!is_tunnel_view)
        setTunnelBackground();
    else
        setIndexBackground();
}

function isZeroClipboardSupported() {
    var ua = navigator.userAgent;
    var m = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    console.log(JSON.stringify(m));//DBG
    if (/trident/i.test(m[1]))
        return false;
    if (/msie/i.test(m[1]))
        return false;
    if (/firefox/i.test(m[1]))
        return false;
    return true;
}

function setupZeroClipboard() {
    if (window.ZeroClipboard === undefined)
        return;
    var client = new ZeroClipboard(document.getElementById("copy-btn"));
    client.on('ready', function (readye) {
        client.on('aftercopy', function (e) {
            console.log("Copied text to clipboard: " + e.data["text/plain"] );
        });
    });
}

$(function() {
    $('#Talk').toggle(false);
    $('#WaitForTalk').toggle(true);
    setBackground();
    $('#start_btn').click(function (e) {
        e.preventDefault();
        window.location.href = "/tunnel.html";
    });
    if (isZeroClipboardSupported()) {
        setupZeroClipboard();
    } else {
        var btn = document.getElementById("copy-btn");
        if (btn)
            btn.parentNode.removeChild(btn);
    }
});

})(jQuery, document, window);

function redirToTalk() {
    $('#Talk').toggle(true);
    $('#WaitForTalk').toggle(false);
}

function handleTalkInputSubmit() {
    var msg = $('#inputmsg').val();
    console.log('input: ' + msg);
    //FIXME need to escape HTML!
    $('#msglist').append('<div class="from-me"><p>' + getMessageHtml(msg) + '</p><span class="timestamp">7:40 AM</span></div><div class="clear"></div>');
    $("#scrollable").scrollTop($('#scrollable')[0].scrollHeight + 1000);
    $('#inputmsg').val('');
    return false;
}

function getMessageHtml(msg) {
    return urlize(msg, { autoescape: true, target: '_blank' })
      .replace(/\n /g, '<br/>&nbsp;')
      .replace(/\n$/, '<br/>&nbsp;')
      .replace(/\n/g, '<br/>')
      .replace(/ {2,}/g, function (space) { return times('&nbsp;', space.length - 1) + ' ' });
}
