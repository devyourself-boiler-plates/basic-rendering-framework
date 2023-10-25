export default function Dialog({ close, children }) {
  return <div class="dialog">
    {children}
    <button onClick={close}>close dialog box</button>
  </div>
}