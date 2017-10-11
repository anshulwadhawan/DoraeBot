$(function(){

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    var socket = io();

    $('button').click(function(){
        recognition.start();
    });

    recognition.addEventListener('result', function(e){
        var last = e.results.length - 1;
        var text = e.results[last][0].transcript
    console.log(text);

    // console.log('Confidence: ' + e.results[0][0].confidence);
    socket.emit('chat_message', text);

    });

    function synthVoice(text) {
        // var voices=window.speechSynthesis.loadVoices();
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        // utterance.voice=voices[0];
        // console.log(voices);
        synth.speak(utterance);
    }

    socket.on('bot_reply', function(replyText) {
        synthVoice(replyText);
    });
})