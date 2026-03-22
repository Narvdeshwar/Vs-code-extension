# Voice Feedback VS Code Extension 🔊

Never miss a terminal success (or failure) again! This extension speaks to you when your commands finish.

## Features 🚀

- **Command Success**: Speaks "Hari Ommm" (Customizable).
- **Command Failure**: Speaks "Aadi ye kya ho gya aadi" (Customizable).
- **Smart Detection**: Uses both terminal output parsing AND modern Shell Integration (VS Code 1.84+).
- **High-Quality Voices**: Powered by `edge-tts` (Microsoft Neural Voices).
- **Windows Optimized**: Uses native PowerShell for playback.

## How to use 🛠️

### 1. Enable Shell Integration (Recommended)
VS Code Shell Integration must be enabled for perfect exit code detection.
- Open Settings (Ctrl+,)
- Search for `Terminal › Integrated › Shell Integration: Enabled`
- Ensure it is checked.

### 2. Manual Exit Code Detection (Optional)
If shell integration is off, you can manually trigger by echoing the exit code:
```bash
npm install; echo EXIT_CODE:$?
```

### 3. Voice Logic
- **Success**: Detects `EXIT_CODE:0`, `✔`, `compiled successfully`, etc.
- **Failure**: Detects non-zero `EXIT_CODE`, `error:`, `failed:`, `command not found`, etc.

## Settings ⚙️

You can customize everything in your VS Code settings:

| Setting | Default | Description |
|---------|---------|-------------|
| `voiceFeedback.enabled` | `true` | Turn voice on/off |
| `voiceFeedback.successMessage` | `Hari Ommm` | Text to speak on success |
| `voiceFeedback.failureMessage` | `Aadi ye kya ho gya aadi` | Text to speak on failure |
| `voiceFeedback.successVoice` | `hi-IN-MadhurNeural` | Success voice (Hindi/Neural) |
| `voiceFeedback.failureVoice` | `hi-IN-SwaraNeural` | Failure voice (Hindi/Neural) |

## How to Test This Extension 🧪

Follow these steps to experience the voice feedback:

### 1. Launch the Extension
1.  Open the project in **VS Code**.
2.  Go to the **Run and Debug** view (`Ctrl + Shift + D`).
3.  Ensure `Run Extension` is selected and press **`F5`**.  
    *A new VS Code window (Extension Development Host) will open.*

### 2. Open a Terminal
In the **new window**, open a integrated terminal (`Ctrl + ~`).

### 3. Run Test Commands
Type these commands to hear different responses:

*   **For Success (Hari Ommm) 🟢:**
    ```bash
    dir
    ```
    *(Or any command that succeeds. If shell integration is off, try `echo Success; echo EXIT_CODE:0`)*

*   **For Failure (Aadi ye kya ho gya aadi) 🔴:**
    ```bash
    not_a_real_command
    ```
    *(Or `echo Error; echo EXIT_CODE:1`)*

### 4. Toggle Voice
1.  Open Command Palette (`Ctrl + Shift + P`).
2.  Type `Voice Feedback: Toggle Enabled/Disabled`.
3.  Observe the notification at the bottom right.

## Troubleshooting 🔧

*   **No Sound?** Check your system volume. The extension uses native Windows PowerShell sounds.
*   **No Speech?** Ensure the `temp` folder exists in your project. The extension should create it automatically.
*   **Slow Response?** The neural voices require an internet connection (Microsoft Edge API).

---
Developed with ❤️ by Antigravity (Advanced Agentic AI)
