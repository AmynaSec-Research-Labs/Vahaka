const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const socketcan = require('socketcan');
const path = require('path');
const { exec } = require('child_process');
const readline = require('readline');

let totalPacketCount = 0;
let randomizeIds = false;

let app_text = 
`
                                                                                         ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣶⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
                                                                                         ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
                                                                                         ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
                     /$$    /$$  /$$$$$$  /$$   /$$  /$$$$$$  /$$   /$$  /$$$$$$         ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⣠⡀⠀⠀⠀⠀⠀⠀⠀⠀ 
                    | $$   | $$ /$$__  $$| $$  | $$ /$$__  $$| $$  /$$/ /$$__  $$        ⠀⠀⠀⠀⣤⡶⠶⠶⠦⣤⣤⣤⣤⣤⣴⡄⠀⠀⠀⠀⢿⣿⣦⡀⠀⠀⠀⠀⠀⠀ 
                    | $$   | $$| $$  \\ $$| $$  | $$| $$  \\ $$| $$ /$$/ | $$  \\ $$     ⠀⠀⠀⢀⣠⣤⣴⣶⣤⣤⡀⢈⡉⠛⠻⠿⠀⠀⠀⠀⢸⣿⣿⣷⠀⣀⠻⠇⠀⠀ 
                    |  $$ / $$/| $$$$$$$$| $$$$$$$$| $$$$$$$$| $$$$$/  | $$$$$$$$        ⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿⣿⠀⠀⠀⠀⠀⠀⢸⣿⣿⠏⢰⣿⣷⣦⠀⠀ 
                     \\  $$ $$/ | $$__  $$| $$__  $$| $$__  $$| $$  $$  | $$__  $$       ⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⠟⢀⣿⣿⣄⠀⠀⠀⠀⠀⣸⣿⠏⠀⠛⣉⣉⠁⠀⠀ 
                      \\  $$$/  | $$  | $$| $$  | $$| $$  | $$| $$\\  $$ | $$  | $$      ⠀⢠⡄⠠⢤⣤⣤⡤⠤⠤⠄⠸⣿⣿⣿⣿⣶⣶⣶⡾⠟⠁⣠⠖⣧⣤⡿⢿⡄⠀ 
                       \\  $/   | $$  | $$| $$  | $$| $$  | $$| $$ \\  $$| $$  | $$      ⠀⢸⣷⠶⣤⡤⢤⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡶⢿⣤⠷⣾⡇⠀
                        \\_/    |__/  |__/|__/  |__/|__/  |__/|__/  \\__/|__/  |__/      ⠀⠀⠙⢷⣿⣶⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣶⣿⡾⠛⠀

    
`;

console.log(app_text);


console.log("\nVAHAKA v1.0 by Amynasec Research Labs.");
console.log("Core Contributors : Arun Mane, Omkar Mali, Smit Verma.\n");

function setupVirtualCAN() {
    console.log('Checking for vcan0 interface...');
    exec('ip link show vcan0', (error) => {
        if (error) {
            console.log('Creating virtual CAN interface vcan0...');
            exec('sudo modprobe vcan', (err1) => {
                if (err1) console.error('Error loading vcan module:', err1);
                else {
                    exec('sudo ip link add dev vcan0 type vcan', (err2) => {
                        if (err2) console.error('Error adding vcan0 interface:', err2);
                        else {
                            exec('sudo ip link set up vcan0', (err3) => {
                                if (err3) console.error('Error setting up vcan0:', err3);
                                else console.log('vcan0 interface created and activated');
                                initializeCANChannel();
                            });
                        }
                    });
                }
            });
        } else {
            console.log('vcan0 interface already exists');
            initializeCANChannel();
        }
    });
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const canInterface = 'vcan0'; 
let channel;

function initializeCANChannel() {
    try {
        channel = socketcan.createRawChannel(canInterface);
        channel.addListener('onMessage', (msg) => {
            const id = msg.id.toString(16);
            const data = msg.data.toString('hex');
            io.emit('canMessage', { id: id, data: data });
            totalPacketCount += 1;
        });
        channel.start();
        console.log('CAN channel initialized successfully');
        console.log('\nSimulator setup complete! Visit the app at localhost:7575\nHappy hacking :)\n');
    } catch (error) {
        console.error('Error initializing CAN channel:', error);
    }
}

app.use(express.static(__dirname));

io.on('connection', (socket) => {

    socket.emit('status', { message: 'Connected to CAN bridge server' });

    socket.on('sendCANMessage', (data) => {
        try {
            const id = typeof data.id === 'string' && data.id.startsWith('0x')
                ? parseInt(data.id, 16)
                : parseInt(data.id);
            const message = {
                id: id,
                data: Buffer.from(data.data, 'hex')
            };
            totalPacketCount += 1;
            if (channel) {
                channel.send(message);
            } else {
                console.error('CAN channel not initialized');
            }
        } catch (error) {
            console.error('Error processing CAN message:', error);
            socket.emit('error', { message: 'Error sending CAN message' });
        }
    });

    socket.on('disconnect', () => {
        // console.log('Client disconnected');
    });

    socket.on('requestRandomization', () => {
        socket.emit('randomizeIds', { randomize: randomizeIds });
    });
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askRandomize() {
    return new Promise((resolve) => {
        console.log("Please select your option :");
        console.log("1. Fixed CANBUS Arbitration IDs");
        console.log("2. Random CANBUS Arbitration IDs");
        rl.question('\nPlease enter your choice : ', (answer) => {
            if (answer === '2') {
                randomizeIds = true;
                console.log('Randomized Arbitration IDs enabled\n');
                io.emit('randomizeIds', { randomize: true });
            } else if (answer === '1') {
                randomizeIds = false;
                console.log('Fixed Arbitration IDs enabled \n');
                io.emit('randomizeIds', { randomize: false });
            } else {
                console.log('Invalid input. Randomized IDs disabled\n');
                io.emit('randomizeIds', { randomize: false });
            }
            resolve();
        });
    });

    
}

async function startServer() {
    await askRandomize();
    server.listen(7575, '127.0.0.1', () => {
        setupVirtualCAN();
    });
}

startServer();

process.on('SIGINT', () => {
    if (channel) {
        channel.stop();
    }
    process.exit(0);
});

