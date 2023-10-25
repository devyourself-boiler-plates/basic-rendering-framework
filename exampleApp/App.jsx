import { makeState } from "../framework";
import Counter from "./Counter";
import Dialog from "./Dialog";

export default function App() {
  const [dialogOpen, setDialogOpen] = makeState(false);
  return (<div style={{ display: "flex" }}>
    <Counter/>
    {!dialogOpen ? (
      <button onClick={() => setDialogOpen(true)}>open dialog box</button>
    ) : (
      <Dialog isOpen={dialogOpen} close={() => setDialogOpen(false)}>
        <Counter/>
      </Dialog>
    )}
  </div>)
}