export function injectStyles(pinColor) {
  if (document.getElementById('fbt-styles')) return

  const css = `
    .fbt-toolbar {
      position: fixed; bottom: 20px; right: 20px;
      display: flex; flex-wrap: wrap; justify-content: flex-end;
      gap: 8px; z-index: 2147483646;
      max-width: calc(100vw - 40px);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .fbt-btn {
      background: white; border: 1px solid #e0e0e0;
      border-radius: 6px; padding: 7px 13px;
      font-size: 13px; font-weight: 500; cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,.12); color: #333;
      white-space: nowrap;
    }
    .fbt-btn:hover { background: #f5f5f5; }
    .fbt-btn-primary {
      background: ${pinColor}; color: white;
      border-color: ${pinColor};
    }
    .fbt-btn-primary:hover { opacity: .9; background: ${pinColor}; }
    .fbt-btn-primary.fbt-active {
      box-shadow: 0 0 0 3px ${pinColor}40;
    }
    .fbt-btn-claude {
      background: #1a73e8; color: white; border-color: #1a73e8; font-size: 12px;
    }
    .fbt-btn-claude:hover { opacity: .9; background: #1a73e8; }

    .fbt-overlay {
      position: absolute; top: 0; left: 0;
      width: 100%; pointer-events: none;
      z-index: 2147483645;
    }
    .fbt-overlay.fbt-sticky { pointer-events: all; cursor: none !important; }
    .fbt-overlay.fbt-sticky * { cursor: none !important; }
    .fbt-overlay.fbt-sticky .fbt-bubble,
    .fbt-overlay.fbt-sticky .fbt-bubble *,
    .fbt-overlay.fbt-sticky .fbt-new-comment,
    .fbt-overlay.fbt-sticky .fbt-new-comment * { cursor: auto !important; }

    .fbt-cursor-pin {
      position: fixed; width: 28px; height: 28px;
      border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
      background: ${pinColor}; pointer-events: none;
      z-index: 2147483648; display: none;
      box-shadow: 0 2px 8px rgba(0,0,0,.25);
    }

    .fbt-pin {
      position: absolute; width: 28px; height: 28px;
      border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
      background: ${pinColor}; display: flex; align-items: center;
      justify-content: center; cursor: pointer; pointer-events: all;
      box-shadow: 0 2px 8px rgba(0,0,0,.25);
      transition: transform .15s;
    }
    .fbt-pin:hover { transform: rotate(-45deg) scale(1.1); }
    .fbt-pin.fbt-resolved { background: #4caf50; }
    .fbt-pin.fbt-orphaned { background: #999; }
    .fbt-pin-number {
      transform: rotate(45deg); color: white;
      font-size: 11px; font-weight: 700;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .fbt-bubble {
      position: absolute; width: 280px; background: white;
      border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,.18);
      z-index: 2147483647; pointer-events: all;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
    }
    .fbt-bubble-header {
      padding: 10px 12px 8px; border-bottom: 1px solid #f0f0f0;
      display: flex; align-items: center; gap: 8px;
    }
    .fbt-avatar {
      width: 24px; height: 24px; border-radius: 50%;
      background: ${pinColor}; color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 700; flex-shrink: 0;
    }
    .fbt-author-name { font-weight: 600; font-size: 12px; }
    .fbt-timestamp { font-size: 11px; color: #aaa; margin-left: auto; }
    .fbt-bubble-text { padding: 10px 12px; color: #333; line-height: 1.5; }
    .fbt-orphaned-badge {
      margin: 0 12px 8px; background: #fff3cd; border-radius: 4px;
      padding: 4px 8px; font-size: 11px; color: #856404;
    }
    .fbt-replies { border-top: 1px solid #f0f0f0; }
    .fbt-reply { padding: 8px 12px; background: #f8f9fa; }
    .fbt-reply:not(:last-child) { border-bottom: 1px solid #f0f0f0; }
    .fbt-bubble-actions {
      padding: 8px 12px; display: flex; gap: 8px;
      border-top: 1px solid #f0f0f0; align-items: center;
    }
    .fbt-action-btn {
      font-size: 11px; color: #666; background: none;
      border: 1px solid #e0e0e0; border-radius: 4px;
      padding: 4px 9px; cursor: pointer;
    }
    .fbt-action-btn:hover { background: #f5f5f5; }
    .fbt-action-btn.fbt-liked { color: ${pinColor}; border-color: ${pinColor}; }
    .fbt-resolve-btn { margin-left: auto; font-size: 10px; }
    .fbt-resolved-badge {
      font-size: 10px; background: #e8f5e9; color: #2e7d32;
      border-radius: 4px; padding: 2px 7px; margin-left: auto;
    }

    .fbt-textarea {
      width: 100%; border: 1px solid #ddd; border-radius: 5px;
      padding: 8px 10px; font-size: 13px; resize: none;
      font-family: inherit; outline: none; box-sizing: border-box;
    }
    .fbt-textarea:focus { border-color: ${pinColor}; }
    .fbt-compose { padding: 10px 12px; }
    .fbt-compose-actions { display: flex; gap: 6px; margin-top: 6px; }

    .fbt-dialog-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 2147483647;
    }
    .fbt-dialog {
      background: white; border-radius: 10px; padding: 24px;
      width: 300px; box-shadow: 0 8px 32px rgba(0,0,0,.2);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .fbt-dialog h3 { font-size: 15px; margin-bottom: 12px; }
    .fbt-input {
      width: 100%; border: 1px solid #ddd; border-radius: 5px;
      padding: 9px 11px; font-size: 14px; margin-bottom: 12px;
      box-sizing: border-box; outline: none;
    }
    .fbt-input:focus { border-color: ${pinColor}; }

    .fbt-toast {
      position: fixed; bottom: 72px; right: 20px;
      background: #333; color: white; border-radius: 6px;
      padding: 10px 16px; font-size: 13px; z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,.2);
    }
  `

  const style = document.createElement('style')
  style.id = 'fbt-styles'
  style.textContent = css
  document.head.appendChild(style)
}
