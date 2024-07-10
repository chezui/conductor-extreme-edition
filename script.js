function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSequence(totalNumbers, lows, highs) {
    let sequence = [];
    let countLows = 0;
    let countHighs = 0;

    while (countLows < lows || countHighs < highs) {
        let number = getRandomInt(1, 10);
        if (number <= 3 && countLows < lows) {
            sequence.push(number);
            countLows++;
        } else if (number >= 8 && countHighs < highs) {
            sequence.push(number);
            countHighs++;
        }
    }

    while (sequence.length < totalNumbers) {
        sequence.push(getRandomInt(1, 10));
    }

    return sequence.sort(() => Math.random() - 0.5);
}

function getColor(number) {
    const gradient = {
        1: '#add8e6', // Light blue
        2: '#87ceeb',
        3: '#00bfff',
        4: '#00ff7f',
        5: 'black',    // Black
        6: '#adff2f',
        7: 'yellow',
        8: '#ff8c00',
        9: '#ff4500',
        10: '#ff0000' // Bright red
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
    ctx.arc(radius, radius, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#e0e0e0';
    ctx.fill();

    // Draw foreground pie slice
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, -0.5 * Math.PI, (percentage * 2 * Math.PI) - 0.5 * Math.PI, false);
    ctx.lineTo(radius, radius);
    ctx.fillStyle = '#add8e6';
    ctx.fill();
}

function displaySequence(sequence, duration, debug, lows, highs, minDuration, maxDuration, callback) {
    let display = document.getElementById('number-display');
    let canvas = document.getElementById('countdown-timer');
    let debugOutput = document.getElementById('debug-output');
    let counts = Array(11).fill(0); // To count occurrences of each number

    function displayNumber(number, displayTime, isLast) {
        if (isLast) {
            display.innerHTML = '<div>Final one!</div>' + number;  // Display "Final one!" above the number
        } else {
            display.textContent = number;
        }
        display.style.color = getColor(number);
        canvas.style.display = 'block';

        let startTime = Date.now();
        let endTime = startTime + displayTime;

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

        if (debug) {
            let regularDisplayTime = displayTime / 0.01; // Since debug mode is 100x faster
            debugOutput.innerHTML += `<p>Number ${number}: Would have been displayed for ${regularDisplayTime / 1000} seconds.</p>`;
        }
    }

    function displayNumber(number, displayTime, isLast) {
    if (isLast) {
        display.innerHTML = '<div style="font-size: 24pt; color: black; font-weight: bold; text-transform: uppercase;">Final one!</div>' + 
                            '<div style="font-size: 200pt; color: ' + getColor(number) + ';">' + number + '</div>';
    } else {
        display.innerHTML = '<div style="font-size: 200pt; color: ' + getColor(number) + ';">' + number + '</div>';
    }

    let startTime = Date.now();
    let endTime = startTime + displayTime;

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

    if (debug) {
        let regularDisplayTime = displayTime / 0.01; // Since debug mode is 100x faster
        let roundedDisplayTime = Math.round(regularDisplayTime / 1000); // Round to nearest second
        debugOutput.innerHTML += `<p>Number ${number}: Would have been displayed for ${roundedDisplayTime} seconds.</p>`;
    }
}
function displayNextNumber(index) {
        let isLast = (index === sequence.length - 1); // Check if it's the last number
        if (index < sequence.length) {
            let number = sequence[index];
            let displayTime = getRandomInt(minDuration * 1000, maxDuration * 1000) * (debug ? 0.01 : 1); // 100x faster in debug mode
            counts[number]++;

            displayNumber(number, displayTime, isLast);

            setTimeout(() => {
                displayNextNumber(index + 1);
            }, displayTime);
        } else {
            display.textContent = '';
            canvas.style.display = 'none';
            callback();

            // Debug output
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

    let speechTopic = getRandomSpeechTopic();
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
    let lowsCount = sequence.filter(num => num <= 3).length;
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
        "The importance of lifelong learning",
        "How to stay positive in difficult times",
        "The funniest thing that ever happened to me",
        "Why you should travel more",
        "The benefits of a healthy diet",
        "The art of perfect timing: When to say what's on your mind",
        "Why every adult should try to relearn a childhood skill",
        "The future of workplace flexibility",
        "The unexpected benefits of waking up early",
        "The greatest invention of the 20th century and its impact",
        "What personal trait has gotten you in the most trouble?",
        "A world without the internet: Predictions for an alternate reality",
        "How to deal with a bad day at the office",
        "The best advice you've never heard",
        "Adventures in dining: The weirdest food I've ever tried",
        "Why do cats rule the internet?",
        "Surviving without modern technology during a power outage",
        "The most memorable book I've read and why",
        "Traveling through time: Where would you go?",
        "The process of choosing what to wear",
        "Decoding dreams: Common themes and interpretations",
        "The best movie villains of all time: A countdown",
        "What makes a great leader?",
        "The joy of doing nothing",
        "The secret life of pets: What are they really thinking?",
        "How to plan the ultimate vacation",
        "The evolution of video games",
        "Understanding body language",
        "The impact of music on our emotional health",
        "The myth of multitasking",
        "The best day of my life",
        "The psychology of social media likes",
        "The mystery of the Bermuda Triangle",
        "Why we love superhero movies",
        "The challenges of learning a new language",
        "The future of space exploration",
        "The importance of art in education",
        "The power of positive thinking",
        "What history can teach us about the future",
        "The weirdest job interview questions",
        "The best ways to manage stress",
        "The most influential tech innovations",
        "What if animals could talk?",
        "The world’s most fascinating myths and legends",
        "How to stay young at heart",
        "The benefits of being a lifelong learner",
        "Why we procrastinate and how to stop",
        "The role of luck in success",
        "The importance of being on time",
        "The impact of climate change on our planet",
        "How to make a good first impression",
        "What would you do with a million dollars?",
        "The importance of voting in every election",
        "The effects of caffeine on the brain",
        "The pros and cons of social networking",
        "Why reading is fundamental",
        "The secrets to a happy marriage",
        "How to live a meaningful life",
        "The magic of the first snowfall",
        "The best ways to save money",
        "What I would do if I were president for a day",
        "The importance of forgiveness",
        "How pets enhance our lives",
        "The future of artificial intelligence",
        "The most bizarre laws from around the world",
        "The best places to find peace and quiet",
        "What would you include in a time capsule?",
        "The benefits of daily exercise",
        "The theory of relativity explained",
        "The mystery behind historical disappearances",
        "How to deal with difficult people",
        "The impact of technology on job markets",
        "The importance of preserving wildlife",
        "The history and impact of comic books",
        "What defines your personal style?",
        "The best pieces of advice for career growth",
        "How to balance work and personal life",
        "The future of renewable energy sources",
        "The impact of globalization",
        "The importance of maintaining cultural heritage",
        "How to boost your creativity",
        "The greatest discoveries from ancient civilizations",
        "What would a world governed by children look like?",
        "The importance of clean water access worldwide",
        "The effects of global warming on polar bears",
        "How to cook like a professional chef",
        "The impact of classical music on the brain",
        "The secrets behind effective public speaking",
        "Why laughter is the best medicine",
        "The future of transportation technology",
        "The impact of daily meditation",
        "The best qualities in a friend",
        "The most challenging professional obstacles",
        "The best ways to support local businesses",
        "The importance of sleep for health",
        "The weirdest traditions from around the world",
        "How to make the perfect cup of coffee",
        "The secrets of ancient architecture",
        "The importance of being environmentally friendly",
        "What if the internet never existed?",
        "The influence of celebrities on public opinion",
        "The evolution of human languages",
        "The best travel destinations for history buffs",
        "The impact of smartphones on modern society",
        "The importance of having hobbies",
        "The role of ethics in business",
        "The impact of sports on global culture",
        "The secrets to a healthy lifestyle",
        "The best ways to overcome fear",
        "The history of the Olympic Games",
        "The influence of advertising on consumer behavior",
        "The importance of community service",
        "The biggest challenges facing education today",
        "The power of a smile",
        "The strangest weather phenomena",
        "The wonders of the animal kingdom",
        "The best innovations in modern architecture",
        "The impact of changing fashion trends",
        "The importance of privacy in the digital age",
        "How to be a good team player",
        "The benefits of bilingualism",
        "The best books on personal development",
        "The history of money",
        "The effects of the stock market on the economy",
        "The importance of maintaining mental health",
        "The most effective ways to negotiate",
        "The best diets for overall health",
        "The secrets of ancient navigation techniques",
        "The challenges of urban planning",
        "The importance of staying informed about current events",
        "The benefits of adopting pets from shelters",
        "The significance of historical landmarks",
        "The evolution of dance throughout history",
        "The role of women in shaping modern society",
        "The impact of viral videos on popular culture",
        "The best ways to protect your data online",
        "The future of virtual reality",
        "The benefits of volunteering",
        "The history of aviation",
        "The most challenging puzzles ever created",
        "The best ways to combat climate change",
        "The secrets to brewing your own beer",
        "The importance of artistic expression",
        "The influence of technology on education",
        "The history of cinema",
        "The best ways to stay motivated",
        "The significance of dream interpretation",
        "The impact of video games on youth",
        "The best cities for street art",
        "The importance of personal safety measures",
        "The secrets to aging gracefully",
        "The impact of drones on society",
        "The best ways to prepare for retirement",
        "The importance of preserving national parks",
        "The benefits of a plant-based diet",
        "The history of martial arts",
        "The challenges of space travel",
        "The best practices for digital marketing",
        "The secrets to successful project management",
        "The importance of sustainable farming",
        "The best strategies for stress relief",
        "The history of cryptography",
        "The impact of nutritional science on health",
        "The best ways to learn a musical instrument",
        "The importance of cybersecurity",
        "The history of tattoos",
        "The best ways to improve your memory",
        "The significance of organic farming",
        "The impact of social justice movements",
        "The best outdoor activities for fitness",
        "The secrets to effective team leadership",
        "The importance of maintaining global peace",
        "The benefits of regular health check-ups",
        "The history of animation",
        "The best practices for effective learning",
        "The secrets of ancient medicine",
        "The impact of podcasts on modern media",
        "The best ways to reduce waste at home",
        "The importance of childhood education",
        "The challenges of modern parenting",
        "The best methods for preserving food",
        "The significance of global trade agreements",
        "The impact of renewable energy on global economies",
        "The best ways to handle rejection",
        "The history of the Internet",
        "The secrets to maintaining long-distance relationships",
        "The importance of wildlife conservation",
        "The best strategies for investing in the stock market",
        "The challenges of genetic research",
        "The importance of cultural diversity",
        "The best ways to maintain personal boundaries",
        "The history of comic books",
        "The impact of mobile apps on daily life",
        "The secrets to effective communication",
        "The importance of ethical consumerism",
        "The history of the Silk Road",
        "The best practices for pet care",
        "The challenges of antibiotic resistance",
        "The importance of creativity in problem-solving",
        "The best ways to manage personal finances",
        "The history of the United Nations",
        "The secrets to successful entrepreneurship",
        "The impact of 3D printing technology",
        "The best ways to avoid burnout",
        "The history of jazz music",
        "The importance of trust in relationships",
        "The challenges of modern healthcare",
        "The best strategies for effective time management",
        "The significance of the Rosetta Stone",
        "The impact of crowdfunding on startups",
        "The best ways to enhance productivity",
        "The history of the Nobel Prize",
        "The secrets to a successful career change",
        "The importance of voting rights",
        "The history of the Paralympic Games",
        "The best strategies for learning a new language",
        "The challenges of climate science",
        "The importance of community in mental health",
        "The best methods for conflict resolution",
        "The history of the pizza",
        "The impact of automation on employment",
        "The best ways to develop leadership skills",
        "The history of solar energy",
        "The secrets to maintaining a healthy diet",
        "The importance of gender equality in the workplace",
        "The challenges of sustainable tourism",
        "The best strategies for building a personal brand",
        "The history of the space race",
        "The impact of artificial intelligence on society",
        "The best ways to stay fit without a gym",
        "The history of the Olympic torch",
        "The secrets to successful conflict resolution",
        "The importance of digital literacy",
        "The challenges of nuclear energy",
        "The best strategies for effective collaboration",
        "The history of tea",
        "The impact of the gig economy",
        "The best ways to foster creativity",
        "The history of mountaineering",
        "The secrets to optimizing your workspace",
        "The importance of community involvement",
        "The challenges of data privacy",
        "The best strategies for healthy living",
        "The history of animation in film",
        "The impact of social networks on personal relationships",
        "The best ways to reduce carbon footprint",
        "The history of the teddy bear",
        "The secrets to effective stress management",
        "The importance of work-life balance",
        "The challenges of urbanization",
        "The best strategies for maintaining mental health",
        "The history of the internet of things",
        "The impact of viral marketing",
        "The best ways to stay informed about politics",
        "The history of the World Cup",
        "The secrets to a successful marriage",
        "The importance of sustainability in business",
        "The challenges of renewable resources",
        "The best strategies for personal development",
        "The history of the Mona Lisa",
        "The impact of digital transformation",
        "The best ways to improve self-esteem",
        "The history of yoga",
        "The secrets to balancing work and life",
        "The importance of ethical leadership",
        "The challenges of global warming",
        "The best strategies for conflict de-escalation",
        "The history of the Louvre Museum",
        "The impact of cryptocurrency",
        "The best ways to handle stress at work",
        "The history of the Great Wall of China",
        "The secrets to a happy life",
        "The importance of financial planning",
        "The challenges of artificial intelligence",
        "The best strategies for effective communication",
        "The history of the Eiffel Tower",
        "The impact of climate change on agriculture",
        "The best ways to deal with change",
        "The history of chocolate",
        "The secrets to successful negotiations",
        "The importance of conserving water",
        "The challenges of space exploration",
        "The best strategies for managing teams",
        "The history of the Roman Empire",
        "The impact of mobile technology",
        "The best ways to improve productivity",
        "The history of the Statue of Liberty",
        "The secrets to a lasting relationship",
        "The importance of cultural awareness",
        "The challenges of online education",
        "The best strategies for learning effectively",
        "The history of the Olympics",
        "The impact of global pandemics",
        "The best ways to stay healthy during flu season",
        "The history of the telephone",
        "The secrets to effective team management",
        "The importance of personal security",
        "The challenges of modern art",
        "The best strategies for creative problem-solving",
        "The history of photography",
        "The impact of social media on privacy",
        "The best ways to stay active",
        "The history of bicycles",
        "The secrets to a successful business venture",
        "The importance of innovation in technology",
        "The challenges of genetic engineering",
        "The best strategies for maintaining friendships",
        "The history of jazz",
        "The impact of e-commerce",
        "The best ways to stay connected with family",
        "The history of television",
        "The secrets to maintaining good health",
        "The importance of community outreach",
        "The challenges of environmental conservation",
        "The best strategies for effective studying",
        "The history of the internet",
        "The impact of biotechnology",
        "The best ways to manage anxiety",
        "The history of cars",
        "The secrets to a balanced diet",
        "The importance of data security",
        "The challenges of digital marketing",
        "The best strategies for dealing with depression",
        "The history of newspapers",
        "The impact of robotics",
        "The best ways to foster innovation",
        "The history of coffee",
        "The secrets to successful time management",
        "The importance of renewable energy",
        "The challenges of water scarcity",
        "The best strategies for career advancement",
        "The history of the printing press",
        "The impact of virtual learning",
        "The best ways to boost energy levels",
        "The history of basketball",
        "The secrets to building trust in teams",
        "The importance of a good night's sleep",
        "The challenges of maintaining public spaces",
        "The best strategies for environmental sustainability",
        "The history of baseball",
        "The impact of the digital divide",
        "The best ways to enhance personal growth",
        "The history of railways",
        "The secrets to effective leadership",
        "The importance of cultural exchange",
        "The challenges of aging populations",
        "The best strategies for business growth",
        "The history of architecture",
        "The impact of nanotechnology",
        "The best ways to handle peer pressure",
        "The history of opera",
        "The secrets to maintaining personal privacy",
        "The importance of physical fitness",
        "The challenges of artificial intelligence in healthcare",
        "The best strategies for building resilience",
        "The history of sailing",
        "The impact of climate change on coastal cities",
        "The best ways to develop empathy",
        "The history of the internet",
        "The secrets to successful fundraising",
        "The importance of community service",
        "The challenges of cybersecurity",
        "The best strategies for managing personal debt",
        "The history of skiing",
        "The impact of globalization on small businesses",
        "The best ways to cultivate patience",
        "The history of tennis",
        "The secrets to successful customer service",
        "The importance of mental health awareness",
        "The challenges of urban development",
        "The best strategies for effective mentorship",
        "The history of gardening",
        "The impact of the sharing economy",
        "The best ways to manage stress",
        "The history of cricket",
        "The secrets to a successful podcast",
        "The importance of sustainable travel",
        "The challenges of data privacy in the digital age",
        "The best strategies for achieving work-life balance",
        "The history of surfing",
        "The impact of mobile apps on productivity",
        "The best ways to build self-confidence",
        "The history of hiking",
        "The secrets to effective crisis management",
        "The importance of diversity in the workplace",
        "The challenges of renewable energy adoption",
        "The best strategies for conflict resolution",
        "The history of scuba diving",
        "The impact of technology on traditional media",
        "The best ways to build a strong community",
        "The history of kayaking",
        "The secrets to a successful YouTube channel",
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
        // 100 Personal, Insightful, Inspiring, Thoughtful Topics
        "What moment in your life did you feel most alive?",
        "If you could send a message to the entire world, what would you say in 30 seconds?",
        "What do you want to be remembered for?",
        "What does your perfect day look like?",
        "Who has been the most influential person in your life and why?",
        "What book or movie profoundly changed your life?",
        "If you could relive one day from your childhood, which day would it be and why?",
        "What has been your biggest challenge, and how did you overcome it?",
        "What is the most valuable lesson you've learned from a failure?",
        "What does true leadership mean to you?",
        "What personal qualities do you think are most important for achieving happiness?",
        "What does success mean to you?",
        "If you could start over, what would you do differently?",
        "What is the most courageous thing you've ever done?",
        "Describe a time when you helped someone else succeed.",
        "What is your most cherished memory?",
        "What one thing do you wish people understood about you?",
        "What legacy do you hope to leave behind?",
        "What do you think is the key to a good work-life balance?",
        "How do you handle criticism?",
        "What's the best piece of advice you've ever received?",
        "What are you most proud of accomplishing?",
        "What's the most important thing you've learned in the last year?",
        "If you had to teach something, what would you teach?",
        "What makes you feel most empowered?",
        "Describe a decision you made that was a turning point in your life.",
        "What do you think the world needs more of right now?",
        "What are some causes you are passionate about?",
        "What does being a friend mean to you?",
        "What has been your biggest surprise in life?",
        "Where do you find inspiration?",
        "What do you think are the biggest misconceptions people have about you?",
        "What kind of legacy do you hope to leave?",
        "What are you most thankful for?",
        "What has been the most defining moment in your life?",
        "What fear would you like to overcome?",
        "What do you do to recharge?",
        "What advice would you give your younger self?",
        "What have you learned from your past relationships?",
        "How do you define success?",
        "What is something you've never done but would like to try?",
        "What are your hopes for the next generation?",
        "What do you think is the meaning of life?",
        "What has been your most humbling experience?",
        "What do you do when you feel overwhelmed?",
        "What is your approach to problem-solving?",
        "How do you deal with change?",
        "What qualities do you admire in others?",
        "What are your top three priorities in life?",
        "What is something you believe that most people don't?",
        "What has been the happiest day of your life so far?",
        "What do you want to achieve in the next year?",
        "What has been a significant turning point in your life?",
        "What values are most important to you?",
        "What has been your biggest personal change over the last few years?",
        "What is the best advice you've ever given?",
        "If you could solve one problem in the world, what would it be?",
        "What are you most curious about?",
        "What is the most important lesson you've learned in life?",
        "What do you hope your future self will remember about this period of your life?",
        "What does resilience mean to you?",
        "How do you stay motivated?",
        "What do you most want to accomplish in your life?",
        "What does friendship mean to you?",
        "How do you handle stress and pressure?",
        "What are your strategies for making big decisions?",
        "What has been your greatest adventure?",
        "What is the most important quality you look for in a friend?",
        "What do you think is your greatest strength?",
        "What is something you've learned recently that inspired you?",
        "How do you approach learning something new?",
        "What is the best part about getting older?",
        "What are you currently trying to improve about yourself?",
        "How has your life been different than what you'd imagined?",
        "How do you want to be remembered?",
        "What are you most passionate about?",
        "What do you think about when you're alone in your car?",
        "What is something you dislike about yourself?",
        "What are you most afraid of?",
        "What are you most proud of?",
        "Where do you see yourself in five years?",
        "What was the best phase in your life?",
        "What was the worst phase in your life?",
        "What's a relationship deal breaker for you?",
        "If you could go back in time, what would you want to change?",
        "What are you most grateful for?",
        "What are the top three things on your bucket list?",
        "What do you think about when you can't sleep?",
        "What has compelled you recently to smile?",
        "If you could have dinner with one person, dead or alive, who would it be?",
        "What book impacted you the most?",
        "If you could live anywhere, where would it be?",
        "What is your biggest regret?",
        "What do you think your life will look like in 10 years?",
        "What do you do for fun?",
        "What was your favorite age growing up?",
        "What's the one thing you would like to change about yourself?",
        "Are you religious or spiritual?",
        "Do you consider yourself an introvert or an extrovert?",
        "Which parent are you closer to and why?",
        "What was the best vacation you ever took and why?",
        "What are your biggest goals for this year?",
        "How do you feel about sharing your password with your partner?",
        "When do you think a person is ready for marriage?",
        "What kind of parent do you think you will be?",
        "Who is that one person you can talk to about just anything?",
        "Do you usually stay friends with your exes?",
        "Have you ever lost someone close to you?",
        "What is something you are financially saving up for currently?",
        "When was the last time you cried?",
        "What is an ideal weekend for you?",
        "What do you think of best friends of the opposite sex?",
        "Do you judge a book by its cover?",
        "Are you confrontational?",
        "When was the last moment you felt truly at peace?",
        "What are you most thankful for this year?",
        "Who in your life has influenced you the most? How did they do it?",
        "What’s your favorite place in the entire world?",
        "What are your top five favorite movies?",
        "What are some of your favorite songs?",
        "What qualities do you admire about your parents?",
        "How would you describe your best friend?",
        "What's your favorite hobby to do alone?",
        "What is something you look forward to every day?",
        "How do you unwind after a long day?",
        "What's the most spontaneous thing you’ve done lately?",
        "What is your greatest fear?",
        "What's the best gift you've ever given?",
        "What's the most beautiful place you've ever been?",
        "What are your guilty pleasures?",
        "What is your favorite thing about your career?",
        "What are you currently reading?",
        "What’s the most incredible natural venue that you’ve ever seen in person?",
        "What are your hobbies?",
        "What are your pet peeves?",
        "What do you do in your free time?",
        "What are your top three favorite books and why?",
        "Who is your favorite author?",
        "What is your favorite food?",
        "What is your favorite quote and why?",
        "What is your favorite word? Why?",
        "What is your biggest pet peeve?",
        "What is your favorite time of day? Day of the week? Month of the year?",
        "What’s the weirdest word in the English language?",
        "How do you start a conversation?",
        "What keys on a keyboard do you not use?",
        "What’s the most interesting thing you can see out of your office or kitchen window?",
        "On a scale of 1-10, how funny would you say you are?",
        "Where do you see yourself in 10 years?",
        "What was your first job?",
        "If you could join any past or current music group, which would you want to join?",
        "How many languages do you speak?",
        "What is your biggest fear or worry?",
        "What is the funniest thing that has happened to you recently?",
        "What is your favorite family vacation?",
        "What would you change about yourself if you could?",
        "What really makes you angry?",
        "What motivates you to work hard?",
        "What is your favorite thing about your career?",
        "What is your biggest complaint about your job?",
        "What is your proudest accomplishment?",
        "What is your child's proudest accomplishment?",
        "What is your favorite book to read?",
        "What makes you laugh the most?",
        "What was the last movie you went to? What did you think?",
        "What did you want to be when you were small?",
        "What does your child want to be when he/she grows up?",
        "If you could choose to do anything for a day, what would it be?",
        "What is your favorite game or sport to watch and play?",
        "Would you rather ride a bike, ride a horse, or drive a car?",
        "What would you sing at Karaoke night?",
        "What two radio stations do you listen to in the car the most?",
        "Which would you rather do: wash dishes, mow the lawn, clean the bathroom, or vacuum the house?",
        "If you could hire someone to help you, would it be with cleaning, cooking, or yard work?",
        "If you could only eat one meal for the rest of your life, what would it be?",
        "Who is your favorite author?",
        "Have you ever had a nickname? What is it?",
        "Do you like or dislike surprises? Why or why not?",
        "In the evening, would you rather play a game, visit a relative, watch a movie, or read?",
        "Would you rather vacation in Hawaii or Alaska, and why?",
        "Would you rather win the lottery or work at the perfect job? And why?",
        "Who would you want to be stranded with on a deserted island?",
        "If money was no object, what would you do all day?",
        "If you could go back in time, what year would you travel to?",
        "How would your friends describe you?",
        "What are your hobbies?",
        "What is the best gift you have been given?",
        "What is the worst gift you have received?",
        "Aside from necessities, what one thing could you not go a day without?",
        "List two pet peeves.",
        "Where do you see yourself in five years?",
        "How many pairs of shoes do you own?",
        "If you were a super-hero, what powers would you have?",
        "What would you do if you won the lottery?",
        "What form of public transportation do you prefer? (air, boat, train, bus, car, etc.)",
        "What's your favorite zoo animal?",
        "If you could go back in time to change one thing, what would it be?",
        "If you could share a meal with any 4 individuals, living or dead, who would they be?",
        "How many pillows do you sleep with?",
        "What's the longest you've gone without sleep (and why)?",
        "What's the tallest building you've been to the top in?",
    ];
    return topics[Math.floor(Math.random() * topics.length)];
}
