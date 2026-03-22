import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

let lastPlayedTime = 0;
const SPEECH_DELAY = 10000; 
let buffer = '';

export function activate(context: vscode.ExtensionContext) {
    console.log('Voice Feedback Extension Activated 🚀');

    // Register Toggle Command
    const toggleCommand = vscode.commands.registerCommand('voice-feedback.toggle', () => {
        const config = vscode.workspace.getConfiguration('voiceFeedback');
        const currentState = config.get<boolean>('enabled', true);
        config.update('enabled', !currentState, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Voice Feedback: ${!currentState ? 'ENABLED 🔊' : 'DISABLED 🔇'}`);
    });
    context.subscriptions.push(toggleCommand);

    const windowAny = vscode.window as any;

    // Strategy 1: Intercept Terminal Data (Proposed API)
    if (windowAny.onDidWriteTerminalData) {
        const terminalListener = windowAny.onDidWriteTerminalData((event: { data: string }) => {
            const config = vscode.workspace.getConfiguration('voiceFeedback');
            if (!config.get<boolean>('enabled')) {
                return;
            }

            const data = event.data;
            buffer += data;
            if (buffer.length > 5000) {
                buffer = buffer.slice(-2000);
            }

            processTerminalData(data, context);
        });
        context.subscriptions.push(terminalListener);
    }

    // Strategy 2: Shell Integration (Stable)
    if (windowAny.onDidEndTerminalShellExecution) {
        const shellListener = windowAny.onDidEndTerminalShellExecution((event: any) => {
            const config = vscode.workspace.getConfiguration('voiceFeedback');
            if (!config.get<boolean>('enabled')) {
                return;
            }

            const exitCode = event.exitCode;
            if (exitCode === 0) {
                playSuccess(context);
            } else if (exitCode !== undefined) {
                playFailure(context);
            }
        });
        context.subscriptions.push(shellListener);
    }
}

function processTerminalData(data: string, context: vscode.ExtensionContext) {
    if (data.includes('EXIT_CODE:0') || data.includes('✔ ')) {
        playSuccess(context);
        return;
    }

    if (data.toLowerCase().includes('compiled successfully') || data.toLowerCase().includes('build successful')) {
        playSuccess(context);
        return;
    }

    const failureMarkers = ['EXIT_CODE:', 'error:', 'failed:', 'command not found', 'compilation failed'];
    for (const marker of failureMarkers) {
        if (data.includes(marker) && !data.includes('EXIT_CODE:0')) {
            playFailure(context);
            return;
        }
    }
}

async function playSuccess(context: vscode.ExtensionContext) {
    const filePath = path.join(context.extensionPath, 'voice', 'true.mp3');
    await playAudioFile(filePath);
}

async function playFailure(context: vscode.ExtensionContext) {
    const filePath = path.join(context.extensionPath, 'voice', 'false.mp3');
    await playAudioFile(filePath);
}

async function playAudioFile(filePath: string) {
    const now = Date.now();
    if (now - lastPlayedTime < SPEECH_DELAY) {
        return;
    }
    lastPlayedTime = now;

    if (!fs.existsSync(filePath)) {
        console.error('Audio file not found:', filePath);
        return;
    }

    // Windows optimized playback via PowerShell
    const command = `powershell -Command "Add-Type -AssemblyName presentationCore; $player = New-Object system.windows.media.mediaplayer; $player.open('${filePath}'); $player.Play(); Start-Sleep -Seconds 10"`;
    try {
        await execPromise(command);
    } catch (e) {
        console.error('Audio Playback Error:', e);
    }
}

export function deactivate() {}
