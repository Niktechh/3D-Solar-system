# 🚀 3D Solar System Simulation

This project is a mobile-responsive web page featuring an interactive 3D simulation of our solar system, built using Three.js and plain JavaScript.

## ✨ Features

* **Realistic 3D Solar System:**
    * The Sun at the center with all 8 planets (Mercury to Neptune) orbiting around it.
    * Each planet rotates around its axis.
    * ]Realistic lighting, camera angles, and smooth orbit animations.
    * Planets are rendered as `THREE.SphereGeometry` objects with detailed textures.
    * Saturn includes a custom ring for added realism.
    * Planetary orbits are animated using `requestAnimationFrame`, ensuring smooth performance.
* **Real-time Speed Control:**
    * A control panel allows users to adjust the orbital speed of *any individual planet* in real-time using sliders.
    * Changes are reflected immediately in the animation.
    * Option to reset individual planet speeds to 'LIVE' (real-time rate).
    * A global time control slider to adjust the overall simulation speed.
* **Bonus Features:**
    * **Pause/Resume Button:** Toggle the animation on or off.
    * **Background Stars:** A vast starfield provides an immersive space environment.
    * **Planet Labels/Tooltips:** Hover over any planet to see its name.
    * **Click-to-Zoom Camera:** Click on a planet to smoothly move the camera and focus on it. A 'Reset View' button returns the camera to its initial position.
    * **Dark/Light Toggle UI:** Switch between dark and light themes for the user interface.
* ]**Optimized Performance:** The scene loads quickly and is designed to work efficiently on modern browsers.
* **Loading Screen:** A custom loading screen with a Lottie animation is displayed while assets are being loaded.

## 🛠️ Technologies Used

* **Three.js:** JavaScript 3D library for rendering graphics in the browser.
* **Pure JavaScript:** All animation and interaction logic implemented without CSS animations.
* **HTML5:** For the web page structure and UI elements.
* **CSS3:** For styling the responsive user interface.
* **Tween.js:** For smooth camera animations and transitions.
* **LottieFiles:** For the animated loading screen.

## 🚀 How to Run the Project

Follow these steps to set up and run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Niktechh/3D-Solar-system
    ```
    

2.  **Navigate to the project directory:**
    ```bash
    cd 3D_Solar_System
    ```
  

3.  **Ensure you have a local web server:**
    This project requires a web server to properly load textures due to browser security restrictions (CORS policy for local file access). You can use any simple local web server. Here are a few common methods:

    * **Python's Simple HTTP Server:**
        If you have Python installed, navigate to the project root directory in your terminal and run:
        ```bash
        python -m http.server
        # For Python 2.x, use: python -m SimpleHTTPServer
        ```
    * **Node.js `http-server` (if you have Node.js installed):**
        First, install it globally if you haven't already:
        ```bash
        npm install -g http-server
        ```
        Then, navigate to the project root directory in your terminal and run:
        ```bash
        http-server
        ```

4.  **Open in your browser:**
    After starting the server, open your web browser and navigate to `http://localhost:8000` (or the port indicated by your server, commonly 8080).

## 📄 Folder Structure
.
├── index.html            // Main HTML file

├── style.css             // Global styles for the UI

├── js/                   // JavaScript files

│   └── main.js           // Core Three.js logic and animations

└── img/                  // Image assets (planet textures, skybox)


├── earth_hd.jpg

├── jupiter_hd.jpg

├── mars_hd.jpg

├── mercury_hd.jpg

├── neptune_hd.jpg

├── saturn_hd.jpg

├── saturn_ring.jpg

├── sun_hd.jpg

├── uranus_hd.jpg

├── venus_hd.jpg

└── skybox/           // Skybox textures

├── space_bk.png

├── space_dn.png

├── space_ft.png

├── space_lf.png

├── space_rt.png

└── space_up.png


## 🎥 Demo Video

A screen recording demonstrating the 3D solar system in motion and the real-time speed control feature is included in the submission bundle. It also provides an explanation of how planets and orbits were created, along with a folder and code walkthrough.
