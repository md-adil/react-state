## 🚀 Effortless Shared State Management for React

`@nebulus/react-state` is a simple and powerful state management library that allows multiple React components to share and synchronize state seamlessly—without prop drilling, context providers, or complex setup. It also supports middleware for handling state transformations.

---

With `@nebulus/react-state`, you can:

- 🔄 Share state across multiple components without passing props.
- ⚡ Update state in real-time with a simple API.
- 🔍 Access and modify global state from anywhere in your application.
- 🛠️ Use middleware for advanced state logic and transformations.
- 🎯 **Efficient re-renders** – Only components using the state hook will update, unlike other libraries that trigger updates across the entire component tree.

---

## 📦 Installation

```bash
npm install @nebulus/react-state
```

---

## 🎯 Getting Started

### 🔧 Creating Shared State

To create a shared state, use the `createState` function. It takes an initial value and optional middleware(s). This allows multiple components to access and update the same state.

```tsx
import { createState } from "@nebulus/react-state";

const useScore = createState(0); // Shared state across components
```

### 📌 Using Shared State in Components

Any component can access and modify the shared state using the hook:

```tsx
function ViewScore() {
  const [score] = useScore();
  return <div>🏆 Score: {score}</div>;
}

function UpdateScore() {
  const [, setScore] = useScore();
  return <button onClick={() => setScore((x) => x + 1)}>➕ Increment</button>;
}

export default function App() {
  return (
    <div>
      <ViewScore />
      <UpdateScore />
      <h2>🌍 Hello world!!!</h2>
    </div>
  );
}
```

---

### ✨ Mutating State Directly

With [immer](https://immerjs.github.io/immer/), you can update nested objects safely:

```tsx
import { createState } from "@nebulus/react-state";

interface IPerson {
  name: string;
  email: string;
  phone: string;
}

export const usePerson = createState<Partial<IPerson>>({});

export function CreatePerson() {
  const [person, setPerson] = usePerson();
  return (
    <div>
      <input
        placeholder="📛 Name"
        value={person.name ?? ""}
        onChange={(e) =>
          setPerson((x) => {
            x.name = e.target.value;
          })
        }
      />
      <input
        placeholder="📧 Email"
        value={person.email ?? ""}
        onChange={(e) =>
          setPerson((x) => {
            x.email = e.target.value;
          })
        }
      />
      <input
        placeholder="📞 Phone"
        value={person.phone ?? ""}
        onChange={(e) =>
          setPerson((x) => {
            x.phone = e.target.value;
          })
        }
      />
    </div>
  );
}
```

---

### ⏩ Updating State Outside Components

Use `dispatch` to update shared state without being inside a React component:

```tsx
setInterval(() => {
  try {
    useScore.dispatch((x) => x + 1);
  } catch (err) {}
}, 1000);
```

---

### 🔍 Retrieving State Globally

Access the current state anywhere in your application:

```tsx
const state = useScore.getState(); // Get the latest score
```

---

### 🎧 Listening for State Changes

You can listen to state changes and react to them dynamically:

```tsx
const unbind = useScore.onChange((x) => {
  console.log("🔄 Score updated:", x);
  unbind(); // Remove listener after first update
});
```

---

## 🛠️ Middleware for Enhanced Control

Middleware functions allow modifying or validating state updates before applying them. The example below enforces a maximum score limit:

```tsx
import { createState, type Middleware } from "@nebulus/react-state";

function validation(max: number): Middleware<number> {
  return function validate(initial, onChange) {
    onChange((val) => {
      if (val > max) {
        throw new Error("🚫 Value limit exceeded");
      }
      return val;
    });
    return initial;
  };
}

const useScore = createState(0, validation(10));
```

---

🔥 **Easily manage and share state across components with `@nebulus/react-state`!**
