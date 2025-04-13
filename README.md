# VAHAKA - Electric Scooter Simulator for Automotive Cybersecurity Practice

## 🚦 About VAHAKA

The name **VAHAKA** (वाहक) is derived from ancient Indian Sanskrit manuscripts, where it means **"carrier" or "vehicle"**. The term symbolizes a medium of movement—perfectly aligning with our mission to offer a dynamic and educational platform for exploring mobility-related cybersecurity threats and defenses.

VAHAKA is designed to replicate the key electronic and communication features of modern electric scooters. It provides a realistic and extensible environment for simulating various attack scenarios.

## 🔍 Key Features

-   Virtual simulation of electric scooter ECUs and CAN communication
-   No physical scooter required – fully software-based platform
-   Safe environment for executing and learning offensive/defensive techniques
-   Suitable for workshops, training sessions, academic research, and industry learning
-   Community-driven and extensible—new features will be added regularly

### 🛵 Electric Scooter Features
-   Engine Start and Stop
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

---
## 🛠️ Installation
### Prerequisites : 
To successfully install and run Vahaka on your Linux system, you need to have :
- NodeJS (at-least version 22.13.1)
- NPM (at-least version 11.1.0)
Note :
- If your system does not have NodeJS installed, the installation script attempts to install the latest version of Node on your system, but if your system already has a lower, unsupported version of Node - the installation script will NOT try to update it (since it can affect your other projects). In this case, you will have to manually update Node and NPM.
- Vahaka might run on Node versions earlier to the mentioned minimums, but this is not guaranteed.
### Method 1 - Using Installation Script
*(Creates a symlink)*
- Run this command in your Linux terminal : 
```bash
curl -sL https://raw.githubusercontent.com/AmynaSec-Research-Labs/Vahaka/refs/heads/main/install.sh | bash
```
- Once installation is successful, start Vahaka from anywhere using the command 
```bash
vahaka
```

### Method 2 - Cloning the Repo
*(Creates no symlink, but you need to be in the Vahaka directory to run)*
- Clone the repository at your desired location :
```bash
git clone https://github.com/AmynaSec-Research-Labs/Vahaka.git
```
*(Or download and extract the .ZIP file)*
- Start Vahaka by entering into the directory and running :
```bash
node server.js
```

---

## 🚀 Roadmap

This is the **first version** of VAHAKA, and it will continue to evolve. Future releases will include:

-   Enhanced connected features (BLE, GSM, GPS, etc.)
-   OTA update simulation
-   Advanced threat modeling modules
-   Real-time telemetry and dashboard integrations

## 🎥 Attack Scenario Demonstrations

We will soon be releasing a series of **attack scenario demonstration videos** on the [Amynasec YouTube Channel](https://youtube.com/@amynaseclabs), showcasing real-world hacking use cases implemented within VAHAKA.

## 🛠️ Contributing

**Contributors:**

-   [Arun Mane](https://github.com/arunm2110)
-   [Omkar Mali](https://github.com/0mk4rm4li)
-   [Smit Verma](https://github.com/smitverma)

We welcome contributions from the community. Please feel free to submit pull requests, report issues, or suggest new features, enhancements and tools.

----------

## 📞 Contact & Support
For questions, support, or collaboration opportunities, reach out via:
- **Website**: [Amynasec Labs](https://amynasec.io)
- **GitHub Issues**: [Submit an Issue](https://github.com/AmynaSec-Research-Labs/Vahaka/issues)

---

_Developed by [Amynasec Labs](https://amynasec.io) for security professionals and researchers._

---
📢 Version Information

This is Vahaka Version 1. Future updates will be released accordingly.
