function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSequence(totalNumbers, lows, highs) {
    let sequence = [];
    let countLows = 0;
    let countHighs = 0;

    // Ensure a minimum count of numbers below 3 and above 8, excluding 0
    while (countLows < lows || countHighs < highs) {
        let number = getRandomInt(0, 10);  // Now includes 0
        if (number >= 1 && number <= 3 && countLows < lows) {
            sequence.push(number);
            countLows++;
        } else if (number >= 8 && countHighs < highs) {
            sequence.push(number);
            countHighs++;
        }
    }

    // Fill up the sequence with any numbers from 0 to 10
    while (sequence.length < totalNumbers) {
        sequence.push(getRandomInt(0, 10));
    }

    return sequence.sort(() => Math.random() - 0.5);
}

function getColor(number) {
    const gradient = {
        0: 'gray',     // Color for zero
        1: '#add8e6',  // Light blue
        2: '#87ceeb',
        3: '#00bfff',
        4: '#00ff7f',
        5: 'black',    // Black
        6: '#adff2f',
        7: 'yellow',
        8: '#ff8c00',
        9: '#ff4500',
        10: '#ff0000'  // Bright red
    };
    return gradient[number];
}

function drawPieChart(percentage) {
    const canvas = document.getElementById('countdown-timer');
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#e0e0e0';
    ctx.fill();

    // Draw foreground pie slice
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, -0.5 * Math.PI, (-0.5 * Math.PI) + (2 * Math.PI * percentage), false);
    ctx.closePath();
    ctx.fillStyle = '#add8e6';
    ctx.fill();
}

function displayNumber(number, displayTime, isLast) {
    let display = document.getElementById('number-display');
    if (number === 0) {
        display.innerHTML = '<div style="font-size: 48pt; color: blue; font-weight: bold;">Breathe in; Breathe out</div>';
        displayTime = 3000; // Fixed duration for "0"
    } else {
        display.innerHTML = isLast ? '<div style="font-size: 24pt; color: black; font-weight: bold; text-transform: uppercase;">Final one!</div>' +
            '<div style="font-size: 200pt; color: ' + getColor(number) + ';">' + number + '</div>' :
            '<div style="font-size: 200pt; color: ' + getColor(number) + ';">' + number + '</div>';
    }

    let startTime = Date.now();
    function updatePieChart() {
        let now = Date.now();
        let elapsedTime = now - startTime;
        let percentage = elapsedTime / displayTime;

        drawPieChart(percentage);

        if (elapsedTime < displayTime) {
            requestAnimationFrame(updatePieChart);
        }
    }

    updatePieChart();
}

function displaySequence(sequence, duration, debug, lows, highs, minDuration, maxDuration, callback) {
    let display = document.getElementById('number-display');
    let canvas = document.getElementById('countdown-timer');
    let debugOutput = document.getElementById('debug-output');
    let counts = Array(11).fill(0); // Including '0' for counting total

    function displayNextNumber(index) {
        let isLast = (index === sequence.length - 1);
        if (index < sequence.length) {
            let number = sequence[index];
            let displayTime = (number === 0) ? 3000 : getRandomInt(minDuration * 1000, maxDuration * 1000) * (debug ? 0.01 : 1);
            if (number !== 0) {
                counts[number]++;
            }

            displayNumber(number, displayTime, isLast);

            setTimeout(() => {
                displayNextNumber(index + 1);
            }, displayTime);
        } else {
            display.textContent = '';
            canvas.style.display = 'none';
            callback();

            if (debug) {
                debugOutput.innerHTML += `<p>Sequence: ${sequence.join(', ')}</p>`;
                debugOutput.innerHTML += `<p>Counts: ${counts.slice(1).join(', ')}</p>`;
                let lowsCount = counts.slice(1, 4).reduce((a, b) => a + b, 0);
                let highsCount = counts.slice(8, 11).reduce((a, b) => a + b, 0);
                debugOutput.innerHTML += `<p>Numbers 1-3: ${lowsCount} (Required: ${lows})</p>`;
                debugOutput.innerHTML += `<p>Numbers 8-10: ${highsCount} (Required: ${highs})</p>`;
            }
        }
    }

    displayNextNumber(0);
}

function countdown(callback) {
    let display = document.getElementById('number-display');
    let countdownTime = 5;
    display.textContent = countdownTime;
    display.style.color = 'black';

    let countdownInterval = setInterval(() => {
        countdownTime--;
        display.textContent = countdownTime;
        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            callback();
        }
    }, 1000);
}

function start() {
    let lows = parseInt(document.getElementById('lows').value);
    let highs = parseInt(document.getElementById('highs').value);
    let duration = parseInt(document.getElementById('duration').value);
    let minDuration = parseInt(document.getElementById('min-duration').value);
    let maxDuration = parseInt(document.getElementById('max-duration').value);
    let debug = document.getElementById('debug').checked;
    let options = document.getElementById('options');

    let totalNumbers = Math.ceil(duration / 10);
    let sequence = generateSequence(totalNumbers, lows, highs);

    options.classList.add('hidden');
    document.getElementById('debug-output').innerHTML = '';

    let speechTopic = getRandomSpeechTopic(); // Assuming you have a function to generate a speech topic
    document.getElementById('speech-topic').textContent = speechTopic;

    countdown(() => {
        displaySequence(sequence, duration, debug, lows, highs, minDuration, maxDuration, () => {
            options.classList.remove('hidden');
            document.getElementById('speech-topic').textContent = '';
        });
    });
}

function testSequences() {
    const totalSequences = 100;
    const lows = parseInt(document.getElementById('lows').value);
    const highs = parseInt(document.getElementById('highs').value);
    let validCount = 0;

    for (let i = 0; i < totalSequences; i++) {
        let totalNumbers = Math.ceil(20 / 10); // Assuming each sequence has 20 numbers (as per initial duration)
        let sequence = generateSequence(totalNumbers, lows, highs);
        if (validateSequence(sequence, lows, highs)) {
            validCount++;
        }
    }

    let percentageValid = (validCount / totalSequences) * 100;
    alert(`Percentage of valid sequences: ${percentageValid.toFixed(2)}%`);
}

function validateSequence(sequence, lows, highs) {
    let lowsCount = sequence.filter(num => num >= 1 && num <= 3).length;
    let highsCount = sequence.filter(num => num >= 8).length;

    return lowsCount >= lows && highsCount >= highs;
}

function updateDurationDisplay() {
    let minDuration = document.getElementById('min-duration').value;
    let maxDuration = document.getElementById('max-duration').value;
    document.getElementById('min-duration-value').textContent = minDuration;
    document.getElementById('max-duration-value').textContent = maxDuration;
}

function getRandomSpeechTopic() {
    const topics = [
        // 100 Funny, Off-the-Wall, Random, Intriguing, and Potentially Controversial Topics
        "If animals could talk, which would be the rudest?",
        "Why are there interstate highways in Hawaii?",
        "Is cereal soup? Why or why not?",
        "What secret conspiracy would you like to start?",
        "What’s invisible but you wish people could see?",
        "Is a hotdog a sandwich? Why or why not?",
        "What’s the weirdest smell you have ever smelled?",
        "What’s the best Wi-Fi name you’ve seen?",
        "If life were a video game, what would some of the cheat codes be?",
        "What’s the most ridiculous fact you know?",
        "How many chickens would it take to kill an elephant?",
        "What is the funniest corporate / business screw up you have heard of?",
        "What would be the worst “buy one get one free” sale of all time?",
        "If peanut butter wasn’t called peanut butter, what would it be called?",
        "What sport would be the funniest to add a mandatory amount of alcohol to?",
        "What would be the creepiest thing you could say while passing a stranger on the street?",
        "What’s the best type of cheese?",
        "What are some of the nicknames you have for customers or coworkers?",
        "If the all the States in the USA were represented by food, what food would each state be represented by?",
        "What mythical creature would improve the world most if it existed?",
        "Why can’t we tickle ourselves?",
        "What part of a kid’s movie completely scarred you?",
        "What kind of secret society would you like to start?",
        "If animals could talk, which would be the rudest?",
        "Toilet paper, over or under?",
        "What’s the best type of cheese?",
        "What’s the most imaginative insult you can come up with?",
        "What used to be considered trashy but now is very classy?",
        "What’s the weirdest thing a guest has done at your house?",
        "What’s the most ridiculous fact you know?",
        "What set of items could you buy that would make the cashier the most uncomfortable?",
        "What would be the absolute worst name you could give your child?",
        "What would be the worst thing for the government to make illegal?",
        "Which body part do you wish you could detach and why?",
        "What’s the weirdest thing you’ve found lying on the ground / side of the road?",
        "What’s the weirdest thing you did as a child?",
        "How do you feel about putting pineapple on pizza?",
        "What part of a kid’s movie completely scarred you?",
        "If you were transported 400 years into the past with no clothes or anything else, how would you prove that you were from the future?",
        "If you were wrongfully put into an insane asylum, how would you convince them that you’re actually sane and not just pretending to be sane?",
        "What would be the coolest animal to scale up to the size of a horse?",
        "What two totally normal things become really weird if you do them back to back?",
        "What set of items could you buy that would make the cashier the most uncomfortable?",
        "What would the world be like if it was filled with male and female copies of you?",
        "What is the weirdest thing you have seen in someone else’s home?",
        "What would be the worst thing for the government to make illegal?",
        "Which body part do you wish you could detach and why?",
        "What used to be considered trashy but now is very classy?",
        "What’s the weirdest thing a guest has done at your house?",
        "What mythical creature would improve the world most if it existed?",
        "What would be the absolute worst name you could give your child?",
        "What would be the coolest animal to scale up to the size of a horse?",
        "What two totally normal things become really weird if you do them back to back?",
        "What would the world be like if it was filled with male and female copies of you?",
        "What is the weirdest thing you have seen in someone else’s home?",
        "If animals could talk, which would be the rudest?",
        "Why can’t we tickle ourselves?",
        "What part of a kid’s movie completely scarred you?",
        "What kind of secret society would you like to start?",
        "If animals could talk, which would be the rudest?",
        "Toilet paper, over or under?",
        "What’s the best type of cheese?",
        "What’s the most imaginative insult you can come up with?",
        "What used to be considered trashy but now is very classy?",
        "What’s the weirdest thing a guest has done at your house?",
        "What’s the most ridiculous fact you know?",
        "What set of items could you buy that would make the cashier the most uncomfortable?",
        "What would be the absolute worst name you could give your child?",
        "What would be the worst thing for the government to make illegal?",
        "Which body part do you wish you could detach and why?",
        "What’s the weirdest thing you’ve found lying on the ground / side of the road?",
        "What’s the weirdest thing you did as a child?",
        "How do you feel about putting pineapple on pizza?",
        "What part of a kid’s movie completely scarred you?",
        "If you were transported 400 years into the past with no clothes or anything else, how would you prove that you were from the future?",
        "If you were wrongfully put into an insane asylum, how would you convince them that you’re actually sane and not just pretending to be sane?",
        "What would be the coolest animal to scale up to the size of a horse?",
        "What two totally normal things become really weird if you do them back to back?",
        "What set of items could you buy that would make the cashier the most uncomfortable?",
        "What would the world be like if it was filled with male and female copies of you?",
        "What is the weirdest thing you have seen in someone else’s home?",
        "What would be the worst thing for the government to make illegal?",
        "Which body part do you wish you could detach and why?",
        "What used to be considered trashy but now is very classy?",
        "What’s the weirdest thing a guest has done at your house?",
        "What mythical creature would improve the world most if it existed?",
        "What would be the absolute worst name you could give your child?",
        "What would be the coolest animal to scale up to the size of a horse?",
        "What two totally normal things become really weird if you do them back to back?",
        "What would the world be like if it was filled with male and female copies of you?",
        "What is the weirdest thing you have seen in someone else’s home?",
        // 100 New Open-Ended Topics
        "What does the ideal life look like to you?",
        "If you could create a new holiday, what would it celebrate?",
        "What's one habit you think everyone should have?",
        "If you could swap lives with a fictional character for a day, who would it be and why?",
        "How would you describe your personal philosophy in three words?",
        "What's a controversial opinion you have about a popular movie, book, or TV show?",
        "If you had to teach a class on one thing, what would you teach?",
        "What’s something that everyone should experience at least once in their life?",
        "What does 'home' mean to you?",
        "What's the most interesting piece of art you've seen, and what did you interpret from it?",
        "How would you spend a billion dollars in a week?",
        "What’s a question you wish people would ask you more?",
        "If you could witness any event of the past, present, or future, what would it be?",
        "What’s the most interesting fact you know?",
        "What’s a skill you’d like to learn and why?",
        "If there were a book about your life, what would the title be?",
        "What’s something you believe that most people don’t?",
        "If you could invent a new technology, what would it do?",
        "What do you think the next big social or technological breakthrough will be?",
        "What’s the most unusual job you can think of?",
        "What would a perfect city look like?",
        "How do you think education will change in the next 50 years?",
        "If you could add one subject to school curriculums worldwide, what would it be and why?",
        "What’s something that’s common sense to you but might not be to someone else?",
        "What would you include in a beginner’s guide to your hobby?",
        "If you could eliminate one thing from your daily routine, what would it be and why?",
        "What’s one mystery you’d like to see solved in your lifetime?",
        "What’s something that you think is underrated?",
        "If you had the power to change one law, what would it be and why?",
        "What’s something from your childhood that you still enjoy?",
        "What would the world look like if you were its ruler?",
        "What’s a song or piece of music that significantly impacts you, and why?",
        "If you could change one aspect of your personality with the snap of your fingers, what would it be?",
        "What’s a book you believe everyone should read?",
        "If you could relive an event in your life, which one would it be and why?",
        "What's an unconventional life lesson you've learned?",
        "What does 'success' mean in today's world?",
        "How do you think technology affects human relationships?",
        "What’s the weirdest tradition your family has?",
        "If you could instantly become an expert in something, what would it be?",
        "What is something that everyone looks stupid doing?",
        "If you could know the absolute truth to one question, what question would you ask?",
        "What’s the most interesting documentary you’ve ever watched?",
        "What’s the best and worst piece of advice you’ve ever received?",
        "What are you currently worried about?",
        "If you could start a charity, what would it be for?",
        "What traits do you think leaders should have?",
        "What’s the most interesting building you’ve ever seen or been in?",
        "What scientific discovery would change the course of humanity overnight if it was discovered?",
        "If you could live in any TV show, which one would it be?",
        "What’s the best thing that happened to you last week?",
        "What’s the farthest you’ve ever been from home?",
        "What’s your personal heaven?",
        "If you could be guaranteed one thing in life (besides money), what would it be?",
        "If you could dedicate your life to solving one problem, what problem would you choose?",
        "What do you think will be the best time period of your entire life?",
        "What’s something you’ve tried that you’ll never try again?",
        "If you could have an all-expenses paid trip to see any famous world monument, which monument would you choose?",
        "If your life was a meal, what kind of meal would it be?",
        "What children’s movie could you watch over and over again?",
        "If you were left on a deserted island with either your worst enemy or no one, which would you choose? Why?",
        "If you could see one movie again for the first time, what would it be and why?",
        "What’s something you like to do the old-fashioned way?",
        "What’s your favorite genre of book or movie and why?",
        "What’s the most heartwarming thing you’ve ever seen?",
        "If you had to change your name, what would you change it to?",
        "What are you most likely to become famous for?",
        "What are you absolutely determined to do?",
        "What is the most impressive thing you know how to do?",
        "What do you wish you knew more about?",
        "What question would you most like to know the answer to?",
        "What question can you ask to find out the most about a person?",
        "When was the last time you changed your opinion or belief about something major?",
        "What was the best compliment you’ve received?",
        "As the only human left on Earth, what would you do?",
        "Who inspires you to be better?",
        "What do you want your epitaph to be?",
        "What did you think you would grow out of but haven’t?",
        "In what situation or place would you feel the most out of place in?",
        "What’s the dumbest thing you’ve done that actually turned out pretty well?",
        "They say that everyone has a book in them. What would your book be about?",
        "What is something you will NEVER do again?",
        "What do you spend the most time thinking about?",
        "What are some of the events in your life that made you who you are?",
        "What do you wish your brain was better at doing?",
        "If you could have the answer to any one question, what question would you want the answer to?",
        "What are your top three priorities?",
        "What would you tell yourself ten years ago?",
        "If you were forced to relive one 10-minute block of your life again and again for all eternity, what 10 minutes of your life would you choose?",
        "What’s something you are self-conscious about?",
        "What personality trait do you value most and which do you dislike the most?",
        
    ];
    return topics[Math.floor(Math.random() * topics.length)];
}
