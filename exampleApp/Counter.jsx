import { makeState } from "../framework";

export default function Counter() {
  const [counter, setCounter] = makeState(0);
  return (<div>
    <button onClick={() => setCounter(Math.max(0, counter-1))}>-</button>
    {counter.toString()}
    <button onClick={() => setCounter(counter+1)}>+</button>
  </div>)
}