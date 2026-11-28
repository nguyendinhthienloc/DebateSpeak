/** A notice, not a dialog: the room and the clock carry on behind it. It never switches to typing by itself. */
export function NoMicNotice({ onType, onDismiss }: { onType: () => void; onDismiss: () => void }) {
  return <div className="no-mic-notice" role="alert">
    <p className="no-mic-title">No microphone found</p>
    <p>Connect a microphone, or keep going by typing.</p>
    <div className="no-mic-actions">
      <button type="button" className="action action-primary" onClick={onType}>Type instead</button>
      <button type="button" className="action action-text" onClick={onDismiss}>Dismiss</button>
    </div>
  </div>;
}
