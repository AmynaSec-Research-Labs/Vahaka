# VAHAKA v2.0 - Electric Scooter Simulator with BLE Control

## 🚦 About VAHAKA

The name **VAHAKA** (वाहक) is derived from ancient Indian Sanskrit manuscripts, where it means **"carrier" or "vehicle"**. The term symbolizes a medium of movement—perfectly aligning with our mission to offer a dynamic and educational platform for exploring mobility-related cybersecurity threats and defenses.

VAHAKA v2.0 is designed to replicate the key electronic and communication features of modern electric scooters with **enhanced Bluetooth Low Energy (BLE) integration**. It provides a realistic and extensible environment for simulating various attack scenarios.

## 🆕 What's New in v2.0

- **🔵 Bluetooth Low Energy (BLE) Engine Control**
- **📱 Mobile App Integration**
- **🔗 Real CAN ID Integration**
- **📊 Enhanced CAN Traffic Monitoring**
- **🔄 Bidirectional Dashboard-BLE Sync**
- **🎯 Clean Sequential Startup Process**

## 🔍 Key Features

-   Virtual simulation of electric scooter ECUs and CAN communication
-   **NEW: Bluetooth Low Energy (BLE) Engine Control**
-   Real CAN ID integration and logging
-   No physical scooter required – fully software-based platform
-   Safe environment for executing and learning offensive/defensive techniques
-   Suitable for workshops, training sessions, academic research, and industry learning
-   Community-driven and extensible—new features will be added regularly

### 🛵 Electric Scooter Features
-   Engine Start and Stop (via Dashboard & BLE)
-   Kick Stand (with Engine Lock)
-   Reverse Gear (with HMI indication)
-   Cruise Control
-   Dynamic Battery Status 
-   Seat Locking and Unlocking
-   Eco Mode (max speed 200 KM/H) and Power Mode (max speed 300 KM/H)
-   Music Player (with interactive controls)
-   Google Map-based GPS
-   Left, Right and Dual Indicators
-   Weather Status

### 📱 BLE Integration Features
-   **BLE Engine Control**: Control engine ON/OFF via mobile apps
-   **Real CAN ID Integration**: Uses same CAN protocol as dashboard
-   **Dashboard Sync**: Real-time updates between BLE and web interface
-   **Device Name**: "VAHAKA-REAL" for easy discovery
-   **Clean Startup**: Sequential initialization process

---
## 📥 Installation
### Prerequisites : 
To successfully install and run Vahaka v2.0 on your Linux system, you need to have :
- NodeJS (at-least version 18.0.0)
- NPM (at-least version 8.0.0)
- Bluetooth adapter (for BLE functionality)
- Linux system with CAN support

### Method 1 - Using Installation Script
*(Recommended - Creates global symlink)*
- Run this command in your Linux terminal : 
```bash
curl -sL https://raw.githubusercontent.com/AmynaSec-Research-Labs/Vahaka/main/install.sh | bash
```
- Once installation is successful, start Vahaka from anywhere using the command 
```bash
vahaka
```

### Method 2 - Cloning the Repo
*(Manual setup - No symlink)*
- Clone the repository at your desired location :
```bash
git clone https://github.com/AmynaSec-Research-Labs/Vahaka.git
```
*(Or download and extract the .ZIP file)*
- Install the prerequisites (in the Vahaka directory) :
```bash
npm install
```
- Start Vahaka server by running :
```bash
node server.js
```

---

## 🚀 Getting Started

### Starting the Simulator
1. **Start the server**:
   ```bash
   vahaka
   # or
   node server.js
   ```

2. **Select CAN Bus Type**:
   - Choose `1` for Fixed CANBUS Arbitration IDs
   - Choose `2` for Random CANBUS Arbitration IDs

3. **Access Dashboard**:
   Open your web browser and go to:
   ```
   http://localhost:7575
   ```

### Using BLE Control
1. **Enable Bluetooth**: Ensure your system's Bluetooth is active
2. **Scan for Devices**: Use any BLE scanner app to find "VAHAKA-REAL"
3. **Connect and Control**: 
   - Write `0x01` to turn engine ON
   - Write `0x02` to turn engine OFF
4. **Monitor Logs**: Watch CAN traffic in the terminal

### Monitoring CAN Traffic
The server displays real-time CAN traffic with:
- **CAN IDs**: Shows actual arbitration IDs
- **Data**: Hexadecimal data values
- **Length**: Message length in bytes
- **Source**: Dashboard vs BLE commands

---

## 🔧 Technical Architecture

### Components
- **server.js**: Main server with BLE integration
- **ble_peripheral.js**: BLE engine control module
- **scripts.js**: Dashboard logic and CAN communication
- **index.html**: Web-based dashboard interface

### Communication Flow
```
Mobile App → BLE → Engine Characteristic → CAN Bus → Dashboard Update
Dashboard → Socket.io → CAN Bus → BLE Update → Mobile App
```

### CAN Protocol
- **Engine ON**: CAN Data `4E` ('N' in hex)
- **Engine OFF**: CAN Data `46` ('F' in hex)
- **Real CAN IDs**: Uses dynamically assigned or fixed arbitration IDs

### BLE Protocol
- **Device Name**: "VAHAKA-REAL"
- **Service UUID**: `12345678-1234-5678-1234-56789abcdef0`
- **Engine Characteristic**: `12345678-1234-5678-1234-56789abcdef1`
- **Commands**: `0x01` (ON), `0x02` (OFF)

---

## 🎯 Use Cases & Attack Scenarios

### Educational Scenarios
- **BLE Engine Hijacking**: Unauthorized engine control via BLE
- **CAN Bus Injection**: Injecting malicious CAN messages
- **Dashboard Manipulation**: Remote dashboard control
- **Replay Attacks**: Capturing and replaying legitimate commands
- **Man-in-the-Middle**: Intercepting BLE communications

### Training Applications
- **Automotive Cybersecurity Workshops**
- **CAN Bus Security Training**
- **BLE Security Testing**
- **IoT Vehicle Security Research**
- **Academic Research Projects**

---

## 🚀 Roadmap

This is **Version 2.0** of VAHAKA with enhanced BLE capabilities. Future releases will include:

-   Enhanced connected features (GSM, GPS, etc.)
-   OTA update simulation
-   Advanced threat modeling modules
-   Real-time telemetry and dashboard integrations
-   Mobile app development
-   Multi-scooter simulation
-   Advanced BLE security features

## 🎥 Attack Scenario Demonstrations

We will soon be releasing a series of **attack scenario demonstration videos** on the [Amynasec YouTube Channel](https://youtube.com/@amynaseclabs), showcasing real-world hacking use cases implemented within VAHAKA v2.0.

### Upcoming Videos
- **BLE Engine Takeover**: Complete walkthrough
- **CAN Bus Injection Attacks**: Practical examples
- **Dashboard Exploitation**: Remote control techniques
- **Defense Mechanisms**: Security best practices

## 🛠️ Contributing

**Contributors:**

-   [Arun Mane](https://github.com/arunm2110)
-   [Omkar Mali](https://github.com/0mk4rm4li)
-   [Smit Verma](https://github.com/smitverma)
-   [Pallavi Gore](https://github.com/gorepallavi)

We welcome contributions from the community. Please feel free to submit pull requests, report issues, or suggest new features, enhancements and tools.

### Development Guidelines
- Follow existing code style
- Test BLE functionality before submitting
- Update documentation for new features
- Ensure CAN protocol compatibility
- Add appropriate security considerations

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

----------

## 📞 Contact & Support
For questions, support, or collaboration opportunities, reach out via:
- **Website**: [Amynasec Labs](https://amynasec.io)
- **GitHub Issues**: [Submit an Issue](https://github.com/AmynaSec-Research-Labs/Vahaka/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AmynaSec-Research-Labs/Vahaka/discussions)

---

## 🔒 Security Notice

This tool is designed for **educational and research purposes only**. Users are responsible for ensuring compliance with applicable laws and regulations when using this software. Do not use on production systems or without proper authorization.

---

_Developed by [Amynasec Labs](https://amynasec.io) for security professionals and researchers._

---
📢 Version Information

This is **Vahaka Version 2.0** with BLE engine control and enhanced CAN integration. Future updates will be released accordingly.

## 🏷️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🛵 Happy Hacking with VAHAKA v2.0!**
