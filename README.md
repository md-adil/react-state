# react-state

`react-state` is a lightweight and flexible state management library for React applications. It provides a simple and intuitive API to manage the state of your components, along with middleware support for handling state transformations.

## Installation

```bash
npm install react-state
```

## Getting Started

### Creating State

To create a state using `react-state`, you can use the `createState` function. It takes an initial value and optional middleware(s) as parameters. In the example below, we create two states: `useScore` and `useProfile`.

```jsx
import { createState } from "react-state";

const useScore = createState(0, validation());
const useProfile = createState({ name: "" });
```

### Using State in Components

To use the state within your components, you can destructure the result of the state hook:

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
```

### Middleware

Middleware functions allow you to modify or validate the state before it is updated. In the provided example, a `validation` middleware is defined to enforce a value limit for the `useScore` state.

```jsx
import { createState, type Middleware } from "react-state";

function validation<T>(): Middleware<T> {
  function handleChange(val: T) {
    if (val > 5) {
      throw new Error("value limit exceeded");
    }
    return val;
  }
  return function validate(initial, onChange) {
    onChange(handleChange);
    return initial;
  };
}

const useScore = createState(0, validation());
```

### Dispatching State Updates

State updates are done using the `dispatch` function provided by the created state. In the example, a score is incremented every second using `setInterval`:

```jsx
setInterval(() => {
  try {
    useScore.dispatch((x) => x + 1);
  } catch (err) {}
}, 1000);
```

### Integrating with Components

Finally, you can integrate your states with your React components, as shown in the `HelloPage` component:

```jsx
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

Now, you have a basic understanding of using `react-state` to manage state in your React application. Explore more features and customization options in the official documentation.
