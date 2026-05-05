"use strict";

function initializeScript() {
    host.diagnostics.debugLog("=== Edge Credential JSON Search v2 - Loaded ===\n");
    return [];
}

function invokeScript() {
    host.diagnostics.debugLog("=== Starting credential search (JSON-focused) ===\n");

    try {
        var ctl = host.namespace.Debugger.Utility.Control;

        // Run targeted native searches and capture output
        host.diagnostics.debugLog("--- Searching for password_value ---\n");
        ctl.ExecuteCommand('s -a 0 L?0x7fffffffffff "password_value"');

        host.diagnostics.debugLog("--- Searching for origin JSON ---\n");
        ctl.ExecuteCommand('s -a 0 L?0x7fffffffffff "{\\"origin\\""');

        host.diagnostics.debugLog("--- Searching for username_value ---\n");
        ctl.ExecuteCommand('s -a 0 L?0x7fffffffffff "username_value"');

        host.diagnostics.debugLog("--- Searching for https credential patterns ---\n");
        ctl.ExecuteCommand('s -a 0 L?0x7fffffffffff "https"');

        host.diagnostics.debugLog("=== Raw search complete. Review Command window for hits. ===\n");

    } catch (e) {
        host.diagnostics.debugLog("Error: " + e + "\n");
    }
}