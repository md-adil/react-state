# React State

`@nebulus/react-state` is a lightweight and flexible shared state management library for React applications like `redux`, `zustand` and `recoil` etc. It provides a simple and intuitive API to manage the state of your components, along with middleware support for handling state transformations.

## Installation

```bash
npm install @nebulus/react-state
```

## Getting Started

### Creating State

To create a state using `@nebulus/react-state`, you can use the `createState` function. It takes an initial value and optional middleware(s) as parameters. In the example below, we create a `useScore` hook.

```jsx
import { createState } from "react-state";

const useScore = createState(0);
```

### Using State in Components

To use the state within your components, you can destructure the result of the state hook just like react `useState` hook:

```jsx
function ViewScore() {
  const [score] = useScore();
  return <div>{score}</div>;
}

function UpdateScore() {
  const [, setScore] = useScore();
  return (
    <div>
      <button onClick={() => setScore((x) => x + 1)}>+</button>
    </div>
  );
}

export default function HelloPage() {
  return (
    <div>
      <ViewScore />
      <UpdateScore />
      <h2>Hello world!!!</h2>
    </div>
  );
}
```

### Middleware

Middleware functions allow you to modify or validate the state before it is updated. In the provided example, a `validation` middleware is defined to enforce a value limit for the `useScore` state.

```tsx
import { createState, type Middleware } from "react-state";

function validation(max: number): Middleware<number> {
  function handleChange(val: number) {
    if (val > max) {
      throw new Error("value limit exceeded");
    }
    return val;
  }
  return function validate(initial, onChange) {
    onChange(handleChange);
    return initial;
  };
}

const useScore = createState(0, validation(10));
```

### Dispatching State Updates

State updates are done using the `dispatch` function without react component provided by the created state. In the example, a score is incremented every second using `setInterval`:

```jsx
setInterval(() => {
  try {
    useScore.dispatch((x) => x + 1);
  } catch (err) {}
}, 1000);
```

### Get state

Getting state using the `getState` function without using react component

```tsx
const state = useScore.getState(); // state will be a number
```

### Listening on change

Adding Listener

```tsx
const unbind = useScore.onChange((x) => {
  console.log(`changing score`, x);
  // detach event
  unbind();
});
```
